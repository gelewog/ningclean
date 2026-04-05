import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string) {
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }
    return this.prisma.fAQ.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.fAQ.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const faq = await this.prisma.fAQ.findUnique({ where: { id } });
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }
    return faq;
  }

  async create(data: CreateFaqDto) {
    return this.prisma.fAQ.create({ data });
  }

  async update(id: string, data: UpdateFaqDto) {
    await this.findOne(id);
    return this.prisma.fAQ.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.fAQ.delete({ where: { id } });
  }
}
