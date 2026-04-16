import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: { page?: number; limit?: number; category?: string; search?: string }) {
    const { page = 1, limit, category, search } = params || {}
    const take = limit || 100;
    const skip = (page - 1) * take;

    const where: Prisma.BlogPostWhereInput = {
      publishedAt: { not: null },
    };

    // Category filter
    if (category) {
      where.category = {
        slug: category,
      };
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        ...(skip > 0 && { skip }),
        take,
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
          viewCount: true,
          likeCount: true,
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    // If no limit specified, return array directly (backward compatible)
    if (!limit) {
      return posts;
    }

    return {
      data: posts,
      total,
      page,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
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
          viewCount: true,
          likeCount: true,
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

  async findBySlug(slug: string, sessionId?: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    // Increment view count
    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    // Check if user has liked this post
    const hasLiked = sessionId ? await this.prisma.blogPostLike.findUnique({
      where: {
        postId_sessionId: {
          postId: post.id,
          sessionId: sessionId,
        },
      },
    }) : null;

    return {
      ...post,
      isLiked: !!hasLiked,
    };
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
        publishedAt: dto.publishedAt || null,
        viewCount: 0,
        likeCount: 0,
      },
    });
  }

  async update(id: string, dto: UpdateBlogDto) {
    await this.findOne(id);
    
    // Build update data - filter out invalid fields for Prisma
    const updateData: Prisma.BlogPostUpdateInput = {
      ...(dto.slug !== undefined && { slug: dto.slug }),
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.excerpt !== undefined && { excerpt: dto.excerpt }),
      ...(dto.content !== undefined && { content: dto.content }),
      ...(dto.coverImage !== undefined && { coverImage: dto.coverImage }),
      ...(dto.author !== undefined && { author: dto.author }),
      ...(dto.tags !== undefined && { tags: dto.tags }),
      ...(dto.readTime !== undefined && { readTime: dto.readTime }),
      ...(dto.categoryId !== undefined && { category: dto.categoryId ? { connect: { id: dto.categoryId } } : { disconnect: true } }),
      ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
      ...(dto.publishedAt !== undefined && { publishedAt: dto.publishedAt }),
    };
    
    return this.prisma.blogPost.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Delete likes first
    await this.prisma.blogPostLike.deleteMany({
      where: { postId: id },
    });
    return this.prisma.blogPost.delete({ where: { id } });
  }

  async like(postId: string, sessionId: string) {
    const post = await this.findOne(postId);
    
    // Check if already liked
    const existingLike = await this.prisma.blogPostLike.findUnique({
      where: {
        postId_sessionId: {
          postId,
          sessionId,
        },
      },
    });

    if (existingLike) {
      return { liked: true, likeCount: post.likeCount };
    }

    // Create like and increment count
    await this.prisma.$transaction([
      this.prisma.blogPostLike.create({
        data: {
          postId,
          sessionId,
        },
      }),
      this.prisma.blogPost.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    return { liked: true, likeCount: post.likeCount + 1 };
  }

  async unlike(postId: string, sessionId: string) {
    const post = await this.findOne(postId);
    
    // Check if like exists
    const existingLike = await this.prisma.blogPostLike.findUnique({
      where: {
        postId_sessionId: {
          postId,
          sessionId,
        },
      },
    });

    if (!existingLike) {
      return { liked: false, likeCount: post.likeCount };
    }

    // Delete like and decrement count
    await this.prisma.$transaction([
      this.prisma.blogPostLike.delete({
        where: {
          postId_sessionId: {
            postId,
            sessionId,
          },
        },
      }),
      this.prisma.blogPost.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);

    return { liked: false, likeCount: Math.max(0, post.likeCount - 1) };
  }
}
