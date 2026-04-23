import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogCategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.blogCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.blogCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async findBySlug(slug: string) {
    return this.prisma.blogCategory.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { isFeatured: true },
          take: 5,
        },
      },
    });
  }

  async create(data: { name: string; slug: string; description?: string; order?: number }) {
    return this.prisma.blogCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        order: data.order || 0,
      },
    });
  }

  async update(id: string, data: { name?: string; slug?: string; description?: string; order?: number }) {
    return this.prisma.blogCategory.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    // Remove category from posts first
    await this.prisma.blogPost.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });
    
    return this.prisma.blogCategory.delete({
      where: { id },
    });
  }

  async reorder(categories: { id: string; order: number }[]) {
    const updates = categories.map((cat) =>
      this.prisma.blogCategory.update({
        where: { id: cat.id },
        data: { order: cat.order },
      })
    );
    return this.prisma.$transaction(updates);
  }
}
