import { Injectable, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
// import * as sharp from 'sharp'; // Disabled for Vercel

export interface FileInfo {
  name: string;
  path: string;
  url: string;
  size: number;
  sizeFormatted: string;
  extension: string;
  type: string;
  createdAt: Date;
  modifiedAt: Date;
  isImage: boolean;
  dimensions?: { width: number; height: number };
}

export interface FolderInfo {
  name: string;
  path: string;
  fileCount: number;
  totalSize: number;
  totalSizeFormatted: string;
}

export interface FileManagerResult {
  files: FileInfo[];
  folders: FolderInfo[];
  totalFiles: number;
  totalSize: number;
  totalSizeFormatted: string;
  apiBaseUrl: string;
}

export interface ClipboardItem {
  sourcePath: string;
  type: 'file' | 'folder';
  operation: 'copy' | 'cut';
  name: string;
}

@Injectable()
export class FileManagerService {
  private readonly UPLOAD_DIR = join(process.cwd(), 'uploads');
  private readonly API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000';

  /**
   * Format bytes to human readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get MIME type based on extension
   */
  private getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
    };
    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
  }

  /**
   * Check if file is an image based on extension
   */
  private isImageFile(ext: string): boolean {
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext.toLowerCase());
  }

  /**
   * Ensure path is within uploads directory (security check)
   */
  private validatePath(filePath: string): string {
    const fullPath = join(this.UPLOAD_DIR, filePath);
    if (!fullPath.startsWith(this.UPLOAD_DIR)) {
      throw new BadRequestException('Invalid file path - path traversal detected');
    }
    return fullPath;
  }

  /**
   * List all files and folders in a directory
   */
  async listFiles(folder?: string): Promise<FileManagerResult> {
    const baseDir = this.UPLOAD_DIR;
    const targetDir = folder ? join(baseDir, folder) : baseDir;

    if (!existsSync(targetDir)) {
      return {
        files: [],
        folders: [],
        totalFiles: 0,
        totalSize: 0,
        totalSizeFormatted: '0 B',
        apiBaseUrl: `${this.API_BASE_URL}/api/upload`,
      };
    }

    const files: FileInfo[] = [];
    const folders: Map<string, { fileCount: number; totalSize: number }> = new Map();
    let totalSize = 0;

    const entries = await fs.readdir(targetDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(targetDir, entry.name);
      const relativePath = folder ? `${folder}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        // Skip certain directories
        if (['node_modules', '.git'].includes(entry.name)) continue;

        // Count files in directory recursively
        const folderStats = await this.countAllFiles(fullPath)
        folders.set(entry.name, {
          fileCount: folderStats.fileCount,
          totalSize: folderStats.totalSize,
        })
      } else if (entry.isFile()) {
        const stats = await fs.stat(fullPath);
        const ext = extname(entry.name);
        const isImage = this.isImageFile(ext);

        // Build URL for the file
        // URL pattern: /api/upload/{folder}/{filename} or /api/upload/{filename}
        let url: string;
        if (folder) {
          url = `${this.API_BASE_URL}/api/upload/${folder}/${entry.name}`;
        } else {
          url = `${this.API_BASE_URL}/api/upload/${entry.name}`;
        }

        files.push({
          name: entry.name,
          path: relativePath,
          url,
          size: stats.size,
          sizeFormatted: this.formatBytes(stats.size),
          extension: ext,
          type: this.getMimeType(ext),
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          isImage,
        });

        totalSize += stats.size;
      }
    }

    // Sort files by modified date (newest first)
    files.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());

    // Convert folders map to array
    const folderList: FolderInfo[] = Array.from(folders.entries()).map(([name, data]) => ({
      name,
      path: folder ? `${folder}/${name}` : name,
      fileCount: data.fileCount,
      totalSize: data.totalSize,
      totalSizeFormatted: this.formatBytes(data.totalSize),
    }));

    return {
      files,
      folders: folderList,
      totalFiles: files.length,
      totalSize,
      totalSizeFormatted: this.formatBytes(totalSize),
      apiBaseUrl: `${this.API_BASE_URL}/api/upload`,
    };
  }

  /**
   * Upload a file to a specific folder
   * NOTE: Sharp/WebP conversion disabled for Vercel (native deps issue)
   */
  async uploadFile(file: Express.Multer.File, folder?: string): Promise<{
    success: boolean
    message: string
    data?: {
      name: string
      path: string
      url: string
      size: number
      sizeFormatted: string
      extension: string
      isImage: boolean
    }
  }> {
    try {
      const targetDir = folder ? join(this.UPLOAD_DIR, folder) : this.UPLOAD_DIR;
      const ext = extname(file.originalname).toLowerCase();
      const baseName = basename(file.originalname, ext);
      // Keep original extension (no WebP conversion)
      const fileName = `${baseName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}${ext || '.bin'}`;
      const filePath = join(targetDir, fileName);
      const originalPath = file.path;

      // Ensure target directory exists
      if (!existsSync(targetDir)) {
        await fs.mkdir(targetDir, { recursive: true });
      }

      // Copy file without conversion (sharp disabled for Vercel)
      await fs.copyFile(originalPath, filePath);
      await fs.unlink(originalPath);

      const finalSize = file.size;
      const relativePath = folder ? `${folder}/${fileName}` : fileName;
      const url = `${this.API_BASE_URL}/api/upload/${relativePath.replace(/\\/g, '/')}`;

      return {
        success: true,
        message: 'File uploaded successfully',
        data: {
          name: fileName,
          path: relativePath,
          url,
          size: finalSize,
          sizeFormatted: this.formatBytes(finalSize),
          extension: ext || '.bin',
          isImage: this.isImageFile(ext),
        },
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to upload file' };
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(filePath: string): Promise<{ success: boolean; message: string }> {
    try {
      const fullPath = this.validatePath(filePath);

      if (!existsSync(fullPath)) {
        return { success: false, message: 'File not found' };
      }

      await fs.unlink(fullPath);
      return { success: true, message: 'File deleted successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to delete file' };
    }
  }

  /**
   * Delete a folder recursively
   */
  async deleteFolder(folderPath: string): Promise<{ success: boolean; message: string }> {
    try {
      const fullPath = this.validatePath(folderPath);

      if (!existsSync(fullPath)) {
        return { success: false, message: 'Folder not found' };
      }

      await fs.rm(fullPath, { recursive: true, force: true });
      return { success: true, message: 'Folder deleted successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to delete folder' };
    }
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(filePaths: string[]): Promise<{ success: boolean; deleted: number; failed: number; errors: string[] }> {
    const errors: string[] = [];
    let deleted = 0;
    let failed = 0;

    for (const filePath of filePaths) {
      const result = await this.deleteFile(filePath);
      if (result.success) {
        deleted++;
      } else {
        failed++;
        errors.push(`${filePath}: ${result.message}`);
      }
    }

    return {
      success: failed === 0,
      deleted,
      failed,
      errors,
    };
  }

  /**
   * Delete multiple items (files and/or folders)
   */
  async deleteItems(items: { path: string; type: 'file' | 'folder' }[]): Promise<{ success: boolean; deleted: number; failed: number; errors: string[] }> {
    const errors: string[] = [];
    let deleted = 0;
    let failed = 0;

    for (const item of items) {
      const result = item.type === 'file'
        ? await this.deleteFile(item.path)
        : await this.deleteFolder(item.path);

      if (result.success) {
        deleted++;
      } else {
        failed++;
        errors.push(`${item.path}: ${result.message}`);
      }
    }

    return {
      success: failed === 0,
      deleted,
      failed,
      errors,
    };
  }

  /**
   * Rename a file or folder - uses copy + delete to handle rename on Windows
   */
  async renameItem(sourcePath: string, newName: string): Promise<{ success: boolean; message: string; newPath?: string }> {
    try {
      const fullSourcePath = this.validatePath(sourcePath);
      const dirPath = dirname(fullSourcePath);
      const newPath = join(dirPath, newName);

      // Validate new path is within uploads
      if (!newPath.startsWith(this.UPLOAD_DIR)) {
        return { success: false, message: 'Invalid target path' };
      }

      if (!existsSync(fullSourcePath)) {
        return { success: false, message: 'Source not found' };
      }

      if (existsSync(newPath)) {
        return { success: false, message: 'A file or folder with this name already exists' };
      }

      // Use copy + delete for reliable rename on Windows
      const isDirectory = existsSync(fullSourcePath) && (await fs.stat(fullSourcePath)).isDirectory();
      if (isDirectory) {
        await this.copyDirectoryRecursive(fullSourcePath, newPath);
        await fs.rm(fullSourcePath, { recursive: true, force: true });
      } else {
        await fs.copyFile(fullSourcePath, newPath);
        await fs.unlink(fullSourcePath);
      }

      // Return relative path
      const relativeNewPath = join(dirname(sourcePath), newName).replace(/\\/g, '/');
      return { success: true, message: 'Renamed successfully', newPath: relativeNewPath };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to rename' };
    }
  }

  /**
   * Copy a file
   */
  async copyFile(sourcePath: string, targetDir: string): Promise<{ success: boolean; message: string; newPath?: string }> {
    try {
      const fullSourcePath = this.validatePath(sourcePath);
      const fullTargetDir = this.validatePath(targetDir);
      const fileName = basename(fullSourcePath);
      const newPath = join(fullTargetDir, fileName);

      if (!existsSync(fullSourcePath)) {
        return { success: false, message: 'Source file not found' };
      }

      if (existsSync(newPath)) {
        // Generate unique name
        const ext = extname(fileName);
        const baseName = basename(fileName, ext);
        const uniqueName = `${baseName}_copy_${Date.now()}${ext}`;
        const uniquePath = join(fullTargetDir, uniqueName);
        await fs.copyFile(fullSourcePath, uniquePath);
        return {
          success: true,
          message: 'File copied successfully',
          newPath: join(targetDir, uniqueName).replace(/\\/g, '/')
        };
      }

      await fs.copyFile(fullSourcePath, newPath);
      return {
        success: true,
        message: 'File copied successfully',
        newPath: join(targetDir, fileName).replace(/\\/g, '/')
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to copy file' };
    }
  }

  /**
   * Move (cut) a file - uses copy + delete to handle cross-folder moves on Windows
   */
  async moveFile(sourcePath: string, targetDir: string): Promise<{ success: boolean; message: string; newPath?: string }> {
    try {
      const fullSourcePath = this.validatePath(sourcePath);
      const fullTargetDir = this.validatePath(targetDir);
      const fileName = basename(fullSourcePath);
      const newPath = join(fullTargetDir, fileName);

      if (!existsSync(fullSourcePath)) {
        return { success: false, message: 'Source file not found' };
      }

      if (existsSync(newPath)) {
        return { success: false, message: 'A file with this name already exists in target directory' };
      }

      // Use copy + delete for reliable cross-folder moves on Windows
      await fs.copyFile(fullSourcePath, newPath);
      await fs.unlink(fullSourcePath);

      return {
        success: true,
        message: 'File moved successfully',
        newPath: join(targetDir, fileName).replace(/\\/g, '/')
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to move file' };
    }
  }

  /**
   * Copy a folder recursively
   */
  async copyFolder(sourcePath: string, targetDir: string): Promise<{ success: boolean; message: string; newPath?: string }> {
    try {
      const fullSourcePath = this.validatePath(sourcePath);
      const fullTargetDir = this.validatePath(targetDir);
      const folderName = basename(fullSourcePath);
      const newPath = join(fullTargetDir, folderName);

      if (!existsSync(fullSourcePath)) {
        return { success: false, message: 'Source folder not found' };
      }

      if (existsSync(newPath)) {
        // Generate unique name
        const uniqueName = `${folderName}_copy_${Date.now()}`;
        const uniquePath = join(fullTargetDir, uniqueName);
        await this.copyDirectoryRecursive(fullSourcePath, uniquePath);
        return {
          success: true,
          message: 'Folder copied successfully',
          newPath: join(targetDir, uniqueName).replace(/\\/g, '/')
        };
      }

      await this.copyDirectoryRecursive(fullSourcePath, newPath);
      return {
        success: true,
        message: 'Folder copied successfully',
        newPath: join(targetDir, folderName).replace(/\\/g, '/')
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to copy folder' };
    }
  }

  /**
   * Move (cut) a folder - uses copy + delete to handle cross-folder moves on Windows
   */
  async moveFolder(sourcePath: string, targetDir: string): Promise<{ success: boolean; message: string; newPath?: string }> {
    try {
      const fullSourcePath = this.validatePath(sourcePath);
      const fullTargetDir = this.validatePath(targetDir);
      const folderName = basename(fullSourcePath);
      const newPath = join(fullTargetDir, folderName);

      if (!existsSync(fullSourcePath)) {
        return { success: false, message: 'Source folder not found' };
      }

      if (existsSync(newPath)) {
        return { success: false, message: 'A folder with this name already exists in target directory' };
      }

      // Use copy + delete for reliable cross-folder moves on Windows
      await this.copyDirectoryRecursive(fullSourcePath, newPath);
      await fs.rm(fullSourcePath, { recursive: true, force: true });

      return {
        success: true,
        message: 'Folder moved successfully',
        newPath: join(targetDir, folderName).replace(/\\/g, '/')
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to move folder' };
    }
  }

  /**
   * Create a new folder
   */
  async createFolder(folderPath: string, folderName: string): Promise<{ success: boolean; message: string; newPath?: string }> {
    try {
      const fullTargetDir = this.validatePath(folderPath);
      const newFolderPath = join(fullTargetDir, folderName);

      if (!newFolderPath.startsWith(this.UPLOAD_DIR)) {
        return { success: false, message: 'Invalid target path' };
      }

      if (existsSync(newFolderPath)) {
        return { success: false, message: 'A folder with this name already exists' };
      }

      await fs.mkdir(newFolderPath, { recursive: true });
      return {
        success: true,
        message: 'Folder created successfully',
        newPath: join(folderPath, folderName).replace(/\\/g, '/')
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to create folder' };
    }
  }

  /**
   * Helper: Copy directory recursively
   */
  private async copyDirectoryRecursive(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectoryRecursive(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  /**
   * Helper: Recursively count files and folders
   */
  private async countAllFiles(dir: string): Promise<{ fileCount: number; folderCount: number; totalSize: number }> {
    let fileCount = 0
    let folderCount = 0
    let totalSize = 0

    if (!existsSync(dir)) {
      return { fileCount, folderCount, totalSize }
    }

    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        folderCount++
        const subResult = await this.countAllFiles(fullPath)
        fileCount += subResult.fileCount
        folderCount += subResult.folderCount
        totalSize += subResult.totalSize
      } else if (entry.isFile()) {
        fileCount++
        const stats = await fs.stat(fullPath)
        totalSize += stats.size
      }
    }

    return { fileCount, folderCount, totalSize }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalSpace: string;
    usedSpace: string;
    fileCount: number;
    folderCount: number;
    byFolder: { name: string; count: number; size: string }[];
  }> {
    const folderStats: { name: string; count: number; size: string }[] = []
    let totalFileCount = 0
    let totalFolderCount = 0
    let totalUsedSize = 0

    // Get stats for each top-level folder
    const entries = await fs.readdir(this.UPLOAD_DIR, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const folderPath = join(this.UPLOAD_DIR, entry.name)
        const result = await this.countAllFiles(folderPath)
        folderStats.push({
          name: entry.name,
          count: result.fileCount,
          size: this.formatBytes(result.totalSize),
        })
        totalFileCount += result.fileCount
        totalFolderCount += result.folderCount
        totalUsedSize += result.totalSize
      } else if (entry.isFile()) {
        // Root-level files
        totalFileCount++
        const stats = await fs.stat(join(this.UPLOAD_DIR, entry.name))
        totalUsedSize += stats.size
      }
    }

    // Calculate total space (used + free)
    // For simplicity, we'll show a reasonable total (e.g., 100GB for typical hosting)
    const totalSpaceGB = 100
    const totalSpaceBytes = totalSpaceGB * 1024 * 1024 * 1024

    return {
      totalSpace: this.formatBytes(totalSpaceBytes),
      usedSpace: this.formatBytes(totalUsedSize),
      fileCount: totalFileCount,
      folderCount: totalFolderCount,
      byFolder: folderStats,
    };
  }
}
