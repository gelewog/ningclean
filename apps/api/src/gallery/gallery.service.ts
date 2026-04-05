import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGalleryItemDto, UpdateGalleryItemDto } from './dto/gallery-item.dto';

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
    await this.findOne(id);
    return this.prisma.galleryItem.delete({ where: { id } });
  }
}
