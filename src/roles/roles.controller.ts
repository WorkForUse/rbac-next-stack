import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SetMetadata } from '@nestjs/common';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @SetMetadata('permission', 'view_roles')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @SetMetadata('permission', 'view_roles')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }
}
