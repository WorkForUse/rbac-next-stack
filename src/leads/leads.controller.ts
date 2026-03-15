import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SetMetadata } from '@nestjs/common';
import { LeadsService } from './leads.service';

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
  create(@Body() createLeadDto: any) {
    return this.leadsService.create(createLeadDto);
  }

  @Patch(':id')
  @SetMetadata('permission', 'manage_leads')
  async update(@Param('id') id: string, @Body() updateLeadDto: any) {
    return this.leadsService.update(+id, updateLeadDto);
  }

  @Delete(':id')
  @SetMetadata('permission', 'manage_leads')
  async remove(@Param('id') id: string) {
    return this.leadsService.remove(+id);
  }
}
