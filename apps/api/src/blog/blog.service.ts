import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.blogPost.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        author: true,
        publishedAt: true,
        tags: true,
        readTime: true,
        createdAt: true,
        category: true,
        isFeatured: true,
      },
    });
  }

  async findAllAdmin(params: {
    page?: number
    limit?: number
    status?: 'draft' | 'published'
    search?: string
  }) {
    const { page = 1, limit = 10, status, search } = params
    const skip = (page - 1) * limit

    const where: Prisma.BlogPostWhereInput = {}

    if (status === 'draft') {
      where.publishedAt = null
    } else if (status === 'published') {
      where.publishedAt = { not: null }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          coverImage: true,
          author: true,
          publishedAt: true,
          tags: true,
          readTime: true,
          createdAt: true,
          updatedAt: true,
          category: true,
          isFeatured: true,
        },
      }),
      this.prisma.blogPost.count({ where }),
    ])

    return {
      data: posts.map((p) => ({
        ...p,
        status: p.publishedAt ? 'published' : 'draft',
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
    });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return post;
  }

  async findOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return post;
  }

  async create(dto: CreateBlogDto) {
    return this.prisma.blogPost.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        excerpt: dto.excerpt || '',
        content: dto.content,
        coverImage: dto.coverImage,
        author: dto.author,
        tags: dto.tags || [],
        readTime: dto.readTime || 5,
        categoryId: dto.categoryId || null,
        isFeatured: dto.isFeatured || false,
      },
    });
  }

  async update(id: string, dto: UpdateBlogDto) {
    await this.findOne(id);
    return this.prisma.blogPost.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.blogPost.delete({ where: { id } });
  }
}
