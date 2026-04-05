import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceAreaDto, UpdateServiceAreaDto } from './dto/service-area.dto';

@Injectable()
export class ServiceAreasService {
  constructor(private prisma: PrismaService) {}

  async findAll(includeFeatured = false) {
    const where: any = { isActive: true };
    if (includeFeatured) {
      where.isFeatured = true;
    }
    return this.prisma.serviceArea.findMany({
      where,
      orderBy: { city: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.serviceArea.findMany({
      orderBy: { city: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const serviceArea = await this.prisma.serviceArea.findUnique({
      where: { slug },
    });
    if (!serviceArea) {
      throw new NotFoundException(`Service area with slug "${slug}" not found`);
    }
    return serviceArea;
  }

  async findOne(id: string) {
    const serviceArea = await this.prisma.serviceArea.findUnique({ where: { id } });
    if (!serviceArea) {
      throw new NotFoundException(`Service area with ID "${id}" not found`);
    }
    return serviceArea;
  }

  async create(dto: CreateServiceAreaDto) {
    return this.prisma.serviceArea.create({ data: dto });
  }

  async update(id: string, dto: UpdateServiceAreaDto) {
    await this.findOne(id);
    return this.prisma.serviceArea.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.serviceArea.delete({ where: { id } });
  }
}
