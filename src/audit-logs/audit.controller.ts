import { Controller, Get, Post, Query, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SetMetadata } from '@nestjs/common';
import { AuditLogService } from './audit.service';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @SetMetadata('permission', 'view_audit')
  async findAll(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditLogService.findAll({
      userId: userId || undefined,
      action: action || undefined,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get(':id')
  @SetMetadata('permission', 'view_audit')
  async findOne(@Param('id') id: string) {
    return this.auditLogService.findOne(+id);
  }

  @Post('log')
  @SetMetadata('permission', 'manage_audit')
  async manualLog(@Body() body: { action: string; details?: string; userId?: string; resourceId?: string }) {
    return this.auditLogService.logAction(
      'manual', // or from req.user
      body.action,
      body.details,
      body.userId,
      body.resourceId,
    );
  }

  @Get('recent')
  @SetMetadata('permission', 'view_audit')
  async recent(@Query('limit') limit: string = '10') {
    return this.auditLogService.recentLogs(parseInt(limit));
  }
}
