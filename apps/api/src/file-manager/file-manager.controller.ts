import { Controller, Get, Delete, Post, Put, Param, Query, Body, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileManagerService } from './file-manager.service';
import { RolesGuard, Roles } from '../common';
import { Role } from '@prisma/client';

@ApiTags('File Manager')
@Controller('file-manager')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Get()
  @ApiOperation({ summary: 'List all files in uploads directory' })
  listFiles(@Query('folder') folder?: string) {
    return this.fileManagerService.listFiles(folder);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiOperation({ summary: 'Upload a file to the file manager' })
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: { folder?: string }) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.fileManagerService.uploadFile(file, body.folder);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get storage statistics' })
  getStats() {
    return this.fileManagerService.getStorageStats();
  }

  // File operations
  @Post('copy')
  @ApiOperation({ summary: 'Copy a file to target directory' })
  copyFile(@Body() body: { sourcePath: string; targetDir: string }) {
    return this.fileManagerService.copyFile(body.sourcePath, body.targetDir);
  }

  @Post('move')
  @ApiOperation({ summary: 'Move (cut) a file to target directory' })
  moveFile(@Body() body: { sourcePath: string; targetDir: string }) {
    return this.fileManagerService.moveFile(body.sourcePath, body.targetDir);
  }

  @Post('folder/copy')
  @ApiOperation({ summary: 'Copy a folder to target directory' })
  copyFolder(@Body() body: { sourcePath: string; targetDir: string }) {
    return this.fileManagerService.copyFolder(body.sourcePath, body.targetDir);
  }

  @Post('folder/move')
  @ApiOperation({ summary: 'Move (cut) a folder to target directory' })
  moveFolder(@Body() body: { sourcePath: string; targetDir: string }) {
    return this.fileManagerService.moveFolder(body.sourcePath, body.targetDir);
  }

  @Post('folder/create')
  @ApiOperation({ summary: 'Create a new folder' })
  createFolder(@Body() body: { folderPath: string; folderName: string }) {
    return this.fileManagerService.createFolder(body.folderPath, body.folderName);
  }

  // Rename
  @Put('rename')
  @ApiOperation({ summary: 'Rename a file or folder' })
  renameItem(@Body() body: { sourcePath: string; newName: string }) {
    return this.fileManagerService.renameItem(body.sourcePath, body.newName);
  }

  // Delete operations
  @Delete(':path')
  @ApiOperation({ summary: 'Delete a file or folder' })
  deleteItem(@Param('path') path: string, @Query('type') type?: 'file' | 'folder') {
    if (type === 'folder') {
      return this.fileManagerService.deleteFolder(path);
    }
    return this.fileManagerService.deleteFile(path);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete multiple files' })
  deleteFiles(@Body() body: { paths: string[]; types?: ('file' | 'folder')[] }) {
    const items = body.paths.map((path, index) => ({
      path,
      type: body.types?.[index] || 'file'
    }));
    return this.fileManagerService.deleteItems(items);
  }
}
