import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { extname, basename } from 'path';

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
  private readonly BUCKET_NAME = 'uploads';
  private readonly SUPABASE_URL = process.env.SUPABASE_URL || '';

  constructor(private readonly supabaseService: SupabaseService) {}

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
   * Get public URL for a file
   */
  private getPublicUrl(path: string): string {
    return `${this.SUPABASE_URL}/storage/v1/object/public/${this.BUCKET_NAME}/${path}`;
  }

  /**
   * List all files and folders in a directory (prefix)
   */
  async listFiles(folder?: string): Promise<FileManagerResult> {
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      throw new BadRequestException('Supabase not configured');
    }

    // Normalize folder path - remove leading/trailing slashes
    const normalizedFolder = folder?.replace(/^\/+|\/+$/g, '') || '';
    const prefix = normalizedFolder ? `${normalizedFolder}/` : '';
    
    console.log('[FileManager] Listing folder:', folder, 'Prefix:', prefix);
    
    const { data: listData, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .list(prefix, {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error('[FileManager] List error:', error);
      return {
        files: [],
        folders: [],
        totalFiles: 0,
        totalSize: 0,
        totalSizeFormatted: '0 B',
        apiBaseUrl: `${this.SUPABASE_URL}/storage/v1/object/public/${this.BUCKET_NAME}`,
      };
    }

    console.log('[FileManager] Raw list data:', listData?.map(i => ({ name: i.name, id: i.id ? 'file' : 'folder' })));

    const files: FileInfo[] = [];
    const folders: FolderInfo[] = [];
    let totalSize = 0;

    for (const item of listData || []) {
      // Skip placeholder files
      if (item.name === '.emptyFolderPlaceholder') continue;

      // Build item path relative to root
      const itemPath = normalizedFolder ? `${normalizedFolder}/${item.name}` : item.name;

      if (item.id === null) {
        // It's a folder (folder entries don't have an id)
        const folderStats = await this.countAllFiles(itemPath);
        folders.push({
          name: item.name,
          path: itemPath,
          fileCount: folderStats.fileCount,
          totalSize: folderStats.totalSize,
          totalSizeFormatted: this.formatBytes(folderStats.totalSize),
        });
      } else {
        // It's a file
        const ext = extname(item.name);
        const isImage = this.isImageFile(ext);
        const size = item.metadata?.size || 0;

        files.push({
          name: item.name,
          path: itemPath,
          url: this.getPublicUrl(itemPath),
          size: size,
          sizeFormatted: this.formatBytes(size),
          extension: ext,
          type: this.getMimeType(ext),
          createdAt: new Date(item.created_at),
          modifiedAt: new Date(item.updated_at || item.created_at),
          isImage,
        });

        totalSize += size;
      }
    }

    // Sort files by modified date (newest first)
    files.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());

    console.log('[FileManager] Result:', { files: files.length, folders: folders.length });

    return {
      files,
      folders,
      totalFiles: files.length,
      totalSize,
      totalSizeFormatted: this.formatBytes(totalSize),
      apiBaseUrl: `${this.SUPABASE_URL}/storage/v1/object/public/${this.BUCKET_NAME}`,
    };
  }

  /**
   * Upload a file to a specific folder in Supabase Storage
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
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      return { success: false, message: 'Supabase not configured' };
    }

    try {
      const ext = extname(file.originalname).toLowerCase();
      const baseName = basename(file.originalname, ext);
      const fileName = `${baseName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}${ext || '.bin'}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file.buffer, {
          contentType: this.getMimeType(ext),
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      const publicUrl = this.getPublicUrl(filePath);

      return {
        success: true,
        message: 'File uploaded successfully',
        data: {
          name: fileName,
          path: filePath,
          url: publicUrl,
          size: file.size,
          sizeFormatted: this.formatBytes(file.size),
          extension: ext || '.bin',
          isImage: this.isImageFile(ext),
        },
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to upload file' };
    }
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(filePath: string): Promise<{ success: boolean; message: string }> {
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      return { success: false, message: 'Supabase not configured' };
    }

    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, message: 'File deleted successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to delete file' };
    }
  }

  /**
   * Delete a folder (all files with prefix) from Supabase Storage
   */
  async deleteFolder(folderPath: string): Promise<{ success: boolean; message: string }> {
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      return { success: false, message: 'Supabase not configured' };
    }

    try {
      // List all files in the folder
      const { data: listData, error: listError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(folderPath, { limit: 1000 });

      if (listError) {
        throw new Error(listError.message);
      }

      // Collect all file paths to delete
      const filesToDelete: string[] = [];
      for (const item of listData || []) {
        if (item.id) {
          // It's a file
          filesToDelete.push(`${folderPath}/${item.name}`);
        } else {
          // It's a subfolder - recursively delete
          await this.deleteFolder(`${folderPath}/${item.name}`);
        }
      }

      // Delete all files in this folder
      if (filesToDelete.length > 0) {
        const { error } = await supabase.storage
          .from(this.BUCKET_NAME)
          .remove(filesToDelete);

        if (error) {
          throw new Error(error.message);
        }
      }

      return { success: true, message: 'Folder deleted successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to delete folder' };
    }
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
   * Delete multiple files
   */
  async deleteFiles(filePaths: string[]): Promise<{ success: boolean; deleted: number; failed: number; errors: string[] }> {
    const items = filePaths.map(path => ({ path, type: 'file' as const }));
    return this.deleteItems(items);
  }

  /**
   * Rename/move a file or folder in Supabase Storage
   */
  async renameItem(sourcePath: string, newName: string): Promise<{ success: boolean; message: string; newPath?: string }> {
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      return { success: false, message: 'Supabase not configured' };
    }

    try {
      const parentPath = sourcePath.includes('/') 
        ? sourcePath.substring(0, sourcePath.lastIndexOf('/')) 
        : '';
      const newPath = parentPath ? `${parentPath}/${newName}` : newName;

      // Supabase doesn't have a native rename - we need to copy and delete
      // First, download the file
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .download(sourcePath);

      if (downloadError) {
        // Maybe it's a folder - try to list
        const { data: listData, error: listError } = await supabase.storage
          .from(this.BUCKET_NAME)
          .list(sourcePath);

        if (listError || !listData) {
          throw new Error('Source not found');
        }

        // It's a folder - copy all contents
        for (const item of listData) {
          if (item.id) {
            // It's a file
            const { data: subFileData } = await supabase.storage
              .from(this.BUCKET_NAME)
              .download(`${sourcePath}/${item.name}`);
            
            if (subFileData) {
              await supabase.storage
                .from(this.BUCKET_NAME)
                .upload(`${newPath}/${item.name}`, subFileData, {
                  contentType: item.metadata?.mimetype || 'application/octet-stream',
                  upsert: false,
                });
            }
          }
        }

        // Delete old folder
        await this.deleteFolder(sourcePath);
      } else {
        // It's a file - upload with new name
        await supabase.storage
          .from(this.BUCKET_NAME)
          .upload(newPath, fileData, {
            contentType: fileData.type || 'application/octet-stream',
            upsert: false,
          });

        // Delete old file
        await supabase.storage
          .from(this.BUCKET_NAME)
          .remove([sourcePath]);
      }

      return { success: true, message: 'Renamed successfully', newPath };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to rename' };
    }
  }

  /**
   * Copy a file in Supabase Storage
   */
  async copyFile(sourcePath: string, targetDir: string): Promise<{ success: boolean; message: string; newPath?: string }> {
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      return { success: false, message: 'Supabase not configured' };
    }

    try {
      const fileName = basename(sourcePath);
      const ext = extname(fileName);
      const baseName = basename(fileName, ext);
      
      // Download the file
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .download(sourcePath);

      if (downloadError) {
        throw new Error(downloadError.message);
      }

      // Generate unique name if exists
      let newFileName = fileName;
      let newPath = targetDir ? `${targetDir}/${newFileName}` : newFileName;
      
      const { data: existingFile } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(targetDir || '', { search: fileName });
      
      if (existingFile && existingFile.length > 0) {
        newFileName = `${baseName}_copy_${Date.now()}${ext}`;
        newPath = targetDir ? `${targetDir}/${newFileName}` : newFileName;
      }

      // Upload to new location
      await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(newPath, fileData, {
          contentType: fileData.type || 'application/octet-stream',
          upsert: false,
        });

      return { success: true, message: 'File copied successfully', newPath };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to copy file' };
    }
  }

  /**
   * Move (cut) a file in Supabase Storage
   */
  async moveFile(sourcePath: string, targetDir: string): Promise<{ success: boolean; message: string; newPath?: string }> {
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      return { success: false, message: 'Supabase not configured' };
    }

    try {
      const fileName = basename(sourcePath);
      const newPath = targetDir ? `${targetDir}/${fileName}` : fileName;

      // Download the file
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .download(sourcePath);

      if (downloadError) {
        throw new Error(downloadError.message);
      }

      // Check if target exists
      const { data: existing } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(targetDir || '', { search: fileName });
      
      if (existing && existing.length > 0) {
        return { success: false, message: 'A file with this name already exists in target directory' };
      }

      // Upload to new location
      await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(newPath, fileData, {
          contentType: fileData.type || 'application/octet-stream',
          upsert: false,
        });

      // Delete from old location
      await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([sourcePath]);

      return { success: true, message: 'File moved successfully', newPath };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to move file' };
    }
  }

  /**
   * Copy a folder in Supabase Storage
   */
  async copyFolder(sourcePath: string, targetDir: string): Promise<{ success: boolean; message: string; newPath?: string }> {
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      return { success: false, message: 'Supabase not configured' };
    }

    try {
      const folderName = basename(sourcePath);
      const ext = extname(folderName);
      const baseName = basename(folderName, ext);
      
      // Check if target exists and generate unique name
      let newFolderName = folderName;
      let newPath = targetDir ? `${targetDir}/${newFolderName}` : newFolderName;
      
      const { data: existingFolder } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(targetDir || '', { search: folderName });
      
      if (existingFolder && existingFolder.some(f => f.name === folderName && !f.id)) {
        newFolderName = `${baseName}_copy_${Date.now()}`;
        newPath = targetDir ? `${targetDir}/${newFolderName}` : newFolderName;
      }

      // List all files in source folder
      const { data: listData, error: listError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(sourcePath, { limit: 1000 });

      if (listError) {
        throw new Error(listError.message);
      }

      // Copy each file
      for (const item of listData || []) {
        if (item.id) {
          // It's a file
          const { data: fileData } = await supabase.storage
            .from(this.BUCKET_NAME)
            .download(`${sourcePath}/${item.name}`);
          
          if (fileData) {
            await supabase.storage
              .from(this.BUCKET_NAME)
              .upload(`${newPath}/${item.name}`, fileData, {
                contentType: item.metadata?.mimetype || 'application/octet-stream',
                upsert: false,
              });
          }
        } else {
          // It's a subfolder - recursive copy
          await this.copyFolder(`${sourcePath}/${item.name}`, newPath);
        }
      }

      return { success: true, message: 'Folder copied successfully', newPath };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to copy folder' };
    }
  }

  /**
   * Move (cut) a folder in Supabase Storage
   */
  async moveFolder(sourcePath: string, targetDir: string): Promise<{ success: boolean; message: string; newPath?: string }> {
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      return { success: false, message: 'Supabase not configured' };
    }

    try {
      const folderName = basename(sourcePath);
      const newPath = targetDir ? `${targetDir}/${folderName}` : folderName;

      // Check if target exists
      const { data: existing } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(targetDir || '', { search: folderName });
      
      if (existing && existing.some(f => f.name === folderName && !f.id)) {
        return { success: false, message: 'A folder with this name already exists in target directory' };
      }

      // Copy folder
      const copyResult = await this.copyFolder(sourcePath, targetDir);
      if (!copyResult.success) {
        return copyResult;
      }

      // Delete old folder
      await this.deleteFolder(sourcePath);

      return { success: true, message: 'Folder moved successfully', newPath: copyResult.newPath };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to move folder' };
    }
  }

  /**
   * Create a new folder in Supabase Storage
   */
  async createFolder(folderPath: string, folderName: string): Promise<{ success: boolean; message: string; newPath?: string }> {
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      return { success: false, message: 'Supabase not configured' };
    }

    try {
      const newPath = folderPath ? `${folderPath}/${folderName}` : folderName;

      // In Supabase, we create a folder by uploading an empty placeholder file
      const placeholderPath = `${newPath}/.emptyFolderPlaceholder`;
      
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(placeholderPath, new Blob(['']), {
          contentType: 'text/plain',
          upsert: false,
        });

      if (error) {
        if (error.message.includes('already exists')) {
          return { success: false, message: 'A folder with this name already exists' };
        }
        throw new Error(error.message);
      }

      return { success: true, message: 'Folder created successfully', newPath };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to create folder' };
    }
  }

  /**
   * Helper: Recursively count files and folders
   */
  private async countAllFiles(prefix: string): Promise<{ fileCount: number; folderCount: number; totalSize: number }> {
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      return { fileCount: 0, folderCount: 0, totalSize: 0 };
    }

    let fileCount = 0;
    let folderCount = 0;
    let totalSize = 0;

    const { data: listData } = await supabase.storage
      .from(this.BUCKET_NAME)
      .list(prefix, { limit: 1000 });

    for (const item of listData || []) {
      if (item.id) {
        // It's a file
        fileCount++;
        totalSize += item.metadata?.size || 0;
      } else {
        // It's a folder
        folderCount++;
        const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
        const subResult = await this.countAllFiles(itemPath);
        fileCount += subResult.fileCount;
        folderCount += subResult.folderCount;
        totalSize += subResult.totalSize;
      }
    }

    return { fileCount, folderCount, totalSize };
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
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      return {
        totalSpace: '0 B',
        usedSpace: '0 B',
        fileCount: 0,
        folderCount: 0,
        byFolder: [],
      };
    }

    const folderStats: { name: string; count: number; size: string }[] = [];
    let totalFileCount = 0;
    let totalFolderCount = 0;
    let totalUsedSize = 0;

    // List root level
    const { data: rootData } = await supabase.storage
      .from(this.BUCKET_NAME)
      .list('', { limit: 1000 });

    for (const item of rootData || []) {
      if (!item.id) {
        // It's a folder
        const result = await this.countAllFiles(item.name);
        folderStats.push({
          name: item.name,
          count: result.fileCount,
          size: this.formatBytes(result.totalSize),
        });
        totalFileCount += result.fileCount;
        totalFolderCount += result.folderCount + 1; // +1 for the folder itself
        totalUsedSize += result.totalSize;
      } else {
        // Root level file
        totalFileCount++;
        totalUsedSize += item.metadata?.size || 0;
      }
    }

    // Calculate total space (used + free estimate)
    const totalSpaceGB = 100;
    const totalSpaceBytes = totalSpaceGB * 1024 * 1024 * 1024;

    return {
      totalSpace: this.formatBytes(totalSpaceBytes),
      usedSpace: this.formatBytes(totalUsedSize),
      fileCount: totalFileCount,
      folderCount: totalFolderCount,
      byFolder: folderStats,
    };
  }
}
