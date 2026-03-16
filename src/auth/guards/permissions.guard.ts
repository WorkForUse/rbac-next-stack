import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../../permissions/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>('permission', context.getHandler());
    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user already has permissions (from seed token or JWT payload)
    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions.includes(requiredPermission);
    }

    // Otherwise, resolve from database
    const permissions = await this.permissionsService.resolvePermissions(user.sub);
    return permissions.includes(requiredPermission);
  }
}