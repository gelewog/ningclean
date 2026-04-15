import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Res,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { extname, join } from 'path';
import * as sharp from 'sharp';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Create subdirectories
const folders = ['gallery', 'services', 'team', 'testimonials', 'settings'];
folders.forEach((folder) => {
  const folderPath = join(UPLOAD_DIR, folder);
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath, { recursive: true });
  }
  // Create thumbs subdirectory
  const thumbsPath = join(folderPath, 'thumbs');
  if (!existsSync(thumbsPath)) {
    mkdirSync(thumbsPath, { recursive: true });
  }
});

@Controller('upload')
export class UploadController {
  @Post(':folder')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req.params.folder;
          const allowedFolders = ['gallery', 'services', 'team', 'testimonials', 'settings'];
          
          if (!allowedFolders.includes(folder)) {
            return cb(new BadRequestException('Invalid upload folder'), '');
          }
          
          const folderPath = join(UPLOAD_DIR, folder);
          cb(null, folderPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only image files (JPEG, PNG, WebP, GIF) are allowed'), false);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') folder: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const originalPath = join(UPLOAD_DIR, folder, file.filename);
    const baseName = file.filename.replace(extname(file.filename), '');
    const webpFilename = `${baseName}.webp`;
    const webpPath = join(UPLOAD_DIR, folder, webpFilename);
    const thumbPath = join(UPLOAD_DIR, folder, 'thumbs', webpFilename);

    try {
      // Convert original to WebP (quality 85 for good balance)
      await sharp(originalPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);

      // Generate thumbnail (300x200, cover fit)
      await sharp(originalPath)
        .resize(300, 200, { fit: 'cover', position: 'center' })
        .webp({ quality: 80, effort: 4 })
        .toFile(thumbPath);

      // Delete original file (keep only WebP)
      await fs.unlink(originalPath);

      // Get file stats
      const webpStats = await fs.stat(webpPath);
      const thumbStats = await fs.stat(thumbPath);

      const fileUrl = `/api/upload/${folder}/${webpFilename}`;
      const thumbUrl = `/api/upload/${folder}/thumbs/${webpFilename}`;

      // Calculate savings
      const savings = ((file.size - webpStats.size) / file.size * 100).toFixed(1);

      return {
        success: true,
        message: 'File uploaded and optimized successfully',
        data: {
          filename: webpFilename,
          originalName: file.originalname,
          originalSize: file.size,
          size: webpStats.size,
          thumbnailSize: thumbStats.size,
          compression: `${savings}%`,
          mimetype: 'image/webp',
          url: fileUrl,
          thumbnailUrl: thumbUrl,
          folder: folder,
        },
      };
    } catch (error) {
      // Cleanup on error
      try {
        if (existsSync(originalPath)) await fs.unlink(originalPath);
        if (existsSync(webpPath)) await fs.unlink(webpPath);
        if (existsSync(thumbPath)) await fs.unlink(thumbPath);
      } catch {}
      throw new BadRequestException('Failed to process image: ' + error.message);
    }
  }

  @Get(':folder/:filename')
  async serveFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(UPLOAD_DIR, folder, filename);
    
    if (!existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    res.sendFile(filePath);
  }

  @Get(':folder/thumbs/:filename')
  async serveThumbnail(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(UPLOAD_DIR, folder, 'thumbs', filename);
    
    if (!existsSync(filePath)) {
      throw new BadRequestException('Thumbnail not found');
    }

    res.sendFile(filePath);
  }
}
