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
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService, UploadResult } from './upload.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../common';
import { Role } from '../common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':folder')
  @ApiOperation({ summary: 'Upload file to Supabase Storage' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') folder: string,
    @Query('subfolder') subfolder?: string,
  ): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.uploadService.uploadFile(file, folder, subfolder);
  }

  @Delete(':path(*)')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete file from Supabase Storage (admin only)' })
  async deleteFile(@Param('path') path: string) {
    await this.uploadService.deleteFile(path);
    return { success: true, message: 'File deleted successfully' };
  }

  @Get('signed-url/:path(*)')
  @ApiOperation({ summary: 'Get signed URL for private files' })
  async getSignedUrl(
    @Param('path') path: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    const url = await this.uploadService.getSignedUrl(
      path,
      expiresIn ? parseInt(expiresIn, 10) : 60,
    );
    return { success: true, data: { signedUrl: url } };
  }

  // Legacy endpoint for backward compatibility - redirect to public URL
  @Get(':folder/:subfolder/:filename')
  async serveFileWithSubfolder(
    @Param('folder') folder: string,
    @Param('subfolder') subfolder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const path = `${folder}/${subfolder}/${filename}`;
    const supabaseUrl = process.env.SUPABASE_URL;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/uploads/${path}`;
    
    res.redirect(publicUrl);
  }

  // Legacy endpoint for backward compatibility - redirect to public URL
  @Get(':folder/:filename')
  async serveFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const path = `${folder}/${filename}`;
    const supabaseUrl = process.env.SUPABASE_URL;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/uploads/${path}`;
    
    res.redirect(publicUrl);
  }
}
