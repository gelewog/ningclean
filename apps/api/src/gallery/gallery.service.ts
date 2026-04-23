import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGalleryItemDto, UpdateGalleryItemDto } from './dto/gallery-item.dto';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string) {
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }
    return this.prisma.galleryItem.findMany({
      where,
      orderBy: { order: 'asc' },
      include: { service: true },
    });
  }

  async findAllAdmin() {
    return this.prisma.galleryItem.findMany({
      orderBy: { order: 'asc' },
      include: { service: true },
    });
  }

  async findOne(id: string) {
    const galleryItem = await this.prisma.galleryItem.findUnique({
      where: { id },
      include: { service: true },
    });
    if (!galleryItem) {
      throw new NotFoundException(`Gallery item with ID "${id}" not found`);
    }
    return galleryItem;
  }

  async create(dto: CreateGalleryItemDto) {
    return this.prisma.galleryItem.create({ data: dto });
  }

  async update(id: string, dto: UpdateGalleryItemDto) {
    await this.findOne(id);
    return this.prisma.galleryItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const item = await this.findOne(id);

    // Delete associated image files
    await this.deleteImageFile(item.imageUrl);
    await this.deleteImageFile(item.beforeImage);
    await this.deleteImageFile(item.afterImage);

    return this.prisma.galleryItem.delete({ where: { id } });
  }

  /**
   * Delete image file from filesystem
   * Handles both regular gallery images and before-after subfolder images
   */
  private async deleteImageFile(imageUrl: string | null | undefined): Promise<void> {
    if (!imageUrl) return;

    try {
      // Extract filename from URL (e.g., "/api/upload/gallery/filename.webp" -> "filename.webp")
      const filename = imageUrl.split('/').pop();
      if (!filename) return;

      // Check various possible paths for the image
      const possiblePaths = [
        // Regular gallery folder
        join(process.cwd(), 'uploads', 'gallery', filename),
        // Before-after subfolder
        join(process.cwd(), 'uploads', 'gallery', 'before-after', filename),
        // Thumbnail in gallery folder
        join(process.cwd(), 'uploads', 'gallery', 'thumbs', filename),
        // Thumbnail in before-after subfolder
        join(process.cwd(), 'uploads', 'gallery', 'before-after', 'thumbs', filename),
      ];

      for (const filePath of possiblePaths) {
        if (existsSync(filePath)) {
          unlinkSync(filePath);
          console.log(`[GalleryService] Deleted image file: ${filePath}`);
        }
      }
    } catch (error) {
      // Log error but don't throw - we don't want to block the deletion of the DB record
      console.error(`[GalleryService] Failed to delete image file ${imageUrl}:`, error);
    }
  }
}
