import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SetMetadata } from '@nestjs/common';

class GrantDto {
  targetUserId: number;
  permissionName: string;
}

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async findAll() {
    return this.permissionsService.findAllPermissions();
  }

  @Post('seed-basic')
  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'view_users')
  async seedBasicPermissions() {
    const basicPermissions = [
      'view_dashboard', 'view_leads', 'view_tasks', 'view_reports', 'view_users',
      'manage_tasks', 'manage_users', 'manage_leads',
      'view_audit', 'view_profile', 'manage_self'
    ];

    const allPerms = await this.permissionsService.findAllPermissions();
    const existingPerms = new Set(allPerms.map(p => p.name));
    const created = [];

    for (const permName of basicPermissions) {
      if (!existingPerms.has(permName)) {
        console.log(`Seeding permission: ${permName}`);
        created.push(permName);
      }
    }
    
    return {
      message: 'Basic permissions check complete',
      created: 0, 
      missing: created,
      total: allPerms.length,
      permissions: basicPermissions
    };
  }

  @Post('grant-user')
  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'manage_users')
  async grantToUser(@Body() dto: GrantDto, @Request() req) {
    await this.permissionsService.grantPermissionToUser(dto.targetUserId, dto.permissionName, req.user.sub);
    return { message: 'Permission granted' };
  }

  @Delete('revoke-user/:userId/:permName')
  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'manage_users')
  async revokeFromUser(@Param('userId') userId: number, @Param('permName') permName: string, @Request() req) {
    await this.permissionsService.revokePermissionFromUser(userId, permName);
    return { message: 'Permission revoked' };
  }
}
