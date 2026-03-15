import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PermissionsService } from '../permissions/permissions.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async login(user: User) {
    const permissions = await this.permissionsService.resolvePermissions(user.id);
    
    const roleName = typeof user.role === 'object' ? user.role.name : user.role;

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: roleName,
      permissions 
    };
    
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);
      
      if (!user || user.status !== 'active') {
        throw new UnauthorizedException('User inactive or not found');
      }
      
      return this.login(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async me(payload: { sub: number; email: string; role: string }) {
    const permissions = await this.permissionsService.resolvePermissions(payload.sub);
    
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      permissions,
    };
  }
}