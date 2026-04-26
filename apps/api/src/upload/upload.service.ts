import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

// UploadResult interface
export interface UploadResult {
  success: boolean;
  message: string;
  data: {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    url: string;
    thumbnailUrl: string;
    folder: string;
  };
}

@Injectable()
export class UploadService {
  private readonly allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedFolders = ['gallery', 'services', 'team', 'testimonials', 'settings'];

  constructor(private readonly supabaseService: SupabaseService) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    subfolder?: string,
  ): Promise<UploadResult> {
    // Validation
    if (!this.allowedFolders.includes(folder)) {
      throw new BadRequestException('Invalid upload folder');
    }

    if (!this.allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files (JPEG, PNG, WebP, GIF) are allowed');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      throw new BadRequestException('Supabase not configured');
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop() || '';
    const filename = `${uniqueSuffix}.${ext}`;

    // Build path
    const path = subfolder ? `${folder}/${subfolder}/${filename}` : `${folder}/${filename}`;
    const bucketName = 'uploads';

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new BadRequestException(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(path);

    return {
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: publicUrl,
        thumbnailUrl: publicUrl, // Can be transformed to thumbnail size
        folder: subfolder ? `${folder}/${subfolder}` : folder,
      },
    };
  }

  async deleteFile(path: string): Promise<void> {
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      throw new BadRequestException('Supabase not configured');
    }

    const { error } = await supabase.storage.from('uploads').remove([path]);

    if (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  async getSignedUrl(path: string, expiresIn: number = 60): Promise<string> {
    const supabase = this.supabaseService.getClient();
    if (!supabase) {
      throw new BadRequestException('Supabase not configured');
    }

    const { data, error } = await supabase.storage
      .from('uploads')
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new BadRequestException(`Signed URL failed: ${error.message}`);
    }

    return data.signedUrl;
  }
}
