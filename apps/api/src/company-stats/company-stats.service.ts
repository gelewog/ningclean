import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyStatDto, UpdateCompanyStatDto } from './dto/company-stat.dto';

@Injectable()
export class CompanyStatsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.companyStat.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.companyStat.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const stat = await this.prisma.companyStat.findUnique({ where: { id } });
    if (!stat) {
      throw new NotFoundException(`Company stat with ID "${id}" not found`);
    }
    return stat;
  }

  async create(dto: CreateCompanyStatDto) {
    return this.prisma.companyStat.create({ data: dto });
  }

  async update(id: string, dto: UpdateCompanyStatDto) {
    await this.findOne(id);
    return this.prisma.companyStat.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.companyStat.delete({ where: { id } });
  }
}
