import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SetMetadata } from '@nestjs/common';

@Controller('reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @SetMetadata('permission', 'view_reports')
  findAll(): Promise<Report[]> {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @SetMetadata('permission', 'view_reports')
  findOne(@Param('id') id: string): Promise<Report> {
    return this.reportsService.findOne(+id);
  }

  @Delete(':id')
  @SetMetadata('permission', 'manage_reports')
  remove(@Param('id') id: string): Promise<void> {
    return this.reportsService.remove(+id);
  }
}
