import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { CurrentUser, RolesGuard, Roles } from '../common';
import { User } from '@prisma/client';
import { Role, BookingStatus } from '../common/enums';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings (customer: own, admin: all)' })
  findAll(@CurrentUser() user: User, @Query() query: any) {
    return this.bookingsService.findAll(user, {
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
      status: query.status,
      area: query.area,
      search: query.search,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      customerId: query.customerId,
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.findOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new booking (public)' })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createPublic(dto);
  }

  @Put(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking status (admin only)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, dto.status);
  }
}
