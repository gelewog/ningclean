import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './dto/team-members.dto';
import { RolesGuard, Roles } from '../common';
import { Role } from '../common';

@ApiTags('Team Members')
@Controller('team-members')
export class TeamMembersController {
  constructor(private teamMembersService: TeamMembersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active team members (public)' })
  findAll() {
    return this.teamMembersService.findAll(false);
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all team members including inactive (admin only)' })
  findAllAdmin() {
    return this.teamMembersService.findAll(true);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get team member by ID (admin only)' })
  findOne(@Param('id') id: string) {
    return this.teamMembersService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create team member (admin only)' })
  create(@Body() data: CreateTeamMemberDto) {
    return this.teamMembersService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update team member (admin only)' })
  update(@Param('id') id: string, @Body() data: UpdateTeamMemberDto) {
    return this.teamMembersService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete team member (admin only)' })
  remove(@Param('id') id: string) {
    return this.teamMembersService.remove(id);
  }
}
