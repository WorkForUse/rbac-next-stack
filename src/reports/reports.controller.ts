import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ValidationPipe, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SetMetadata } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

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

  @Post()
  @SetMetadata('permission', 'manage_reports')
  async create(@Body(ValidationPipe) createReportDto: CreateReportDto, @Req() req: any): Promise<Report> {
    return this.reportsService.create(createReportDto, req.user.sub);
  }

  @Patch(':id')
  @SetMetadata('permission', 'manage_reports')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateReportDto: UpdateReportDto): Promise<Report> {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  @SetMetadata('permission', 'manage_reports')
  remove(@Param('id') id: string): Promise<void> {
    return this.reportsService.remove(+id);
  }
}
