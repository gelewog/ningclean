import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Res,
  Param,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { existsSync, mkdirSync, promises as fs } from 'fs';
import { extname, join } from 'path';

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
});

@Controller('upload')
export class UploadController {
  @Post(':folder')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req.params.folder;
          const subfolder = req.query.subfolder as string;
          const allowedFolders = ['gallery', 'services', 'team', 'testimonials', 'settings'];

          if (!allowedFolders.includes(folder)) {
            return cb(new BadRequestException('Invalid upload folder'), '');
          }

          // If subfolder is specified
          if (subfolder) {
            const folderPath = join(UPLOAD_DIR, folder, subfolder);
            if (!existsSync(folderPath)) {
              mkdirSync(folderPath, { recursive: true });
            }
            cb(null, folderPath);
          } else {
            const folderPath = join(UPLOAD_DIR, folder);
            cb(null, folderPath);
          }
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
    @Query('subfolder') subfolder: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Build URLs
    const fileUrl = subfolder
      ? `/api/upload/${folder}/${subfolder}/${file.filename}`
      : `/api/upload/${folder}/${file.filename}`;

    return {
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl,
        thumbnailUrl: fileUrl, // Same as original (no thumbnail processing)
        folder: subfolder ? `${folder}/${subfolder}` : folder,
      },
    };
  }

  @Get(':folder/:subfolder/:filename')
  async serveFileWithSubfolder(
    @Param('folder') folder: string,
    @Param('subfolder') subfolder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(UPLOAD_DIR, folder, subfolder, filename);

    if (!existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    res.sendFile(filePath);
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
}
