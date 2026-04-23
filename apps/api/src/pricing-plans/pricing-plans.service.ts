import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePricingPlanDto, UpdatePricingPlanDto } from './dto/pricing-plan.dto';

@Injectable()
export class PricingPlansService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.pricingPlan.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const pricingPlan = await this.prisma.pricingPlan.findUnique({ where: { id } });
    if (!pricingPlan) {
      throw new NotFoundException(`Pricing plan with ID "${id}" not found`);
    }
    return pricingPlan;
  }

  async create(dto: CreatePricingPlanDto) {
    return this.prisma.pricingPlan.create({ data: dto });
  }

  async update(id: string, dto: UpdatePricingPlanDto) {
    await this.findOne(id);
    return this.prisma.pricingPlan.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pricingPlan.delete({ where: { id } });
  }
}
