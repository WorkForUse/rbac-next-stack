import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SetMetadata } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';

@Controller('leads')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @SetMetadata('permission', 'view_leads')
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  @SetMetadata('permission', 'view_leads')
  async findOne(@Param('id') id: string) {
    return this.leadsService.findOne(+id);
  }

  @Post()
  @SetMetadata('permission', 'manage_leads')
  create(@Body(ValidationPipe) createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Patch(':id')
  @SetMetadata('permission', 'manage_leads')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(+id, updateLeadDto);
  }

  @Post(':id/assign')
  @SetMetadata('permission', 'manage_leads')
  async assignLead(@Param('id') id: string, @Body(ValidationPipe) assignLeadDto: AssignLeadDto) {
    return this.leadsService.assignLead(+id, assignLeadDto.assignToUserId);
  }

  @Post(':id/unassign')
  @SetMetadata('permission', 'manage_leads')
  async unassignLead(@Param('id') id: string) {
    return this.leadsService.unassignLead(+id);
  }

  @Delete(':id')
  @SetMetadata('permission', 'manage_leads')
  async remove(@Param('id') id: string) {
    return this.leadsService.remove(+id);
  }
}
