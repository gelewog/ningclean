import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(includeInactive = false, city?: string) {
    // Build where clause
    const where: any = includeInactive ? {} : { isActive: true };

    // If city is provided, filter by availableCities
    // Service is available if:
    // - availableCities is empty (means available in all cities)
    // - OR availableCities contains the requested city
    if (city) {
      where.OR = [
        { availableCities: { isEmpty: true } },
        { availableCities: { has: city.toLowerCase() } },
      ];
    }

    return this.prisma.service.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async findBySlug(slug: string) {
    const service = await this.prisma.service.findUnique({ where: { slug } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async create(dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        price: dto.price,
        duration: dto.duration,
        category: dto.category,
        image: dto.image,
        icon: dto.icon,
        features: dto.features || [],
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
        availableCities: dto.availableCities || [],
      },
    });
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);
    return this.prisma.service.update({
      where: { id },
      data: {
        ...dto,
        features: dto.features || undefined,
        availableCities: dto.availableCities !== undefined ? dto.availableCities : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.service.delete({ where: { id } });
  }
}
