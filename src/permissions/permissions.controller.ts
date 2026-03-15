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
