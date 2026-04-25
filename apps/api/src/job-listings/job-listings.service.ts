import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobListingDto, UpdateJobListingDto } from './dto/job-listing.dto';

@Injectable()
export class JobListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly = true) {
    const where: any = {};
    if (activeOnly) {
      where.isActive = true;
    }
    return this.prisma.jobListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.jobListing.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const jobListing = await this.prisma.jobListing.findUnique({ where: { id } });
    if (!jobListing) {
      throw new NotFoundException(`Job listing with ID "${id}" not found`);
    }
    return jobListing;
  }

  async create(dto: CreateJobListingDto) {
    return this.prisma.jobListing.create({ data: dto });
  }

  async update(id: string, dto: UpdateJobListingDto) {
    await this.findOne(id);
    return this.prisma.jobListing.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.jobListing.delete({ where: { id } });
  }
}
