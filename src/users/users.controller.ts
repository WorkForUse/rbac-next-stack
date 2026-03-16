import { Controller, Get, Post, Patch, Delete, Body, Req, Param, UseGuards, ForbiddenException, SetMetadata, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @SetMetadata('permission', 'view_users')
  async findAll() {
    return this.usersService.findAllWithPermissionNames();
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'view_users')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'manage_users')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'manage_users')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'manage_users')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/assign-permissions')
  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'manage_users')
  async assignPermissions(@Param('id') targetUserId: string, @Req() req: any, @Body() body: { permissions: string[] }) {
    const requestedPermissions = body.permissions;
    const currentUser = req.user;

    if (currentUser.role === 'Admin') {
      return this.usersService.updateUserPermissions(targetUserId, requestedPermissions);
    }

    const managerPermissions = currentUser.permissions.map((p: any) => p.name);
    const hasViolation = requestedPermissions.some(perm => !managerPermissions.includes(perm));

    if (hasViolation) {
      throw new ForbiddenException('Grant Ceiling Violation: You cannot grant permissions you don\'t hold yourself.');
    }

    return this.usersService.updateUserPermissions(targetUserId, requestedPermissions);
  }

  @Post(':id/revoke-permissions')
  @UseGuards(PermissionsGuard)
  @SetMetadata('permission', 'manage_users')
  async revokePermissions(@Param('id') targetUserId: string, @Req() req: any, @Body() body: { permissions: string[] }) {
    const permissionsToRevoke = body.permissions;
    const user = await this.usersService.findOne(targetUserId);
    const currentPerms = user.permissions ? user.permissions.map((p: any) => p.name) : [];
    const remainingPerms = currentPerms.filter(p => !permissionsToRevoke.includes(p));
    return this.usersService.updateUserPermissions(targetUserId, remainingPerms);
  }
}