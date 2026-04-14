import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findAll(areaSlug?: string) {
    return this.prisma.testimonial.findMany({
      where: {
        isActive: true,
        ...(areaSlug && { areaSlug }),
      },
      orderBy: [
        { isFeatured: 'desc' },
        { order: 'asc' },
      ],
    });
  }

  async findAllAdmin() {
    return this.prisma.testimonial.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }
    return testimonial;
  }

  async create(data: CreateTestimonialDto) {
    return this.prisma.testimonial.create({ data });
  }

  async update(id: string, data: UpdateTestimonialDto) {
    await this.findOne(id);
    return this.prisma.testimonial.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.testimonial.delete({ where: { id } });
  }
}
