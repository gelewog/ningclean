import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';
import { RolesGuard, Roles } from '../common';
import { Role } from '@prisma/client';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private faqService: FaqService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active FAQs (public)' })
  findAll(@Query('category') category?: string) {
    return this.faqService.findAll(category);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get FAQs by category (public)' })
  findByCategory(@Param('category') category: string) {
    return this.faqService.findAll(category);
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all FAQs including inactive (admin only)' })
  findAllAdmin() {
    return this.faqService.findAllAdmin();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get FAQ by ID (admin only)' })
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create FAQ (admin only)' })
  create(@Body() data: CreateFaqDto) {
    return this.faqService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update FAQ (admin only)' })
  update(@Param('id') id: string, @Body() data: UpdateFaqDto) {
    return this.faqService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete FAQ (admin only)' })
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}
