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
    const roleName = typeof user.role === 'object' ? user.role?.name : user.role;

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: roleName,
      permissions 
    };
    
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        role: roleName,
        permissions: permissions
      }
    };
  }

  async refreshToken(refreshToken: string) {
    // Try JWT first
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);
      
      if (!user || user.status !== 'active') {
        throw new UnauthorizedException('User inactive or not found');
      }
      
      return this.login(user);
    } catch (jwtError) {
      // If JWT fails, try seed data token (base64 encoded JSON)
      try {
        let decodedStr: string;
        try {
          decodedStr = Buffer.from(refreshToken, 'base64').toString('utf-8');
        } catch (decodeErr) {
          throw jwtError; // Re-throw original JWT error if base64 decode fails
        }

        let payload;
        try {
          payload = JSON.parse(decodedStr);
        } catch (parseErr) {
          // Try extracting JSON by counting braces
          let braceCount = 0;
          let jsonEndIndex = -1;
          for (let i = 0; i < decodedStr.length; i++) {
            if (decodedStr[i] === '{') braceCount++;
            else if (decodedStr[i] === '}') {
              braceCount--;
              if (braceCount === 0) {
                jsonEndIndex = i + 1;
                break;
              }
            }
          }
          
          if (jsonEndIndex > 0) {
            const jsonStr = decodedStr.substring(0, jsonEndIndex);
            payload = JSON.parse(jsonStr);
          } else {
            throw jwtError;
          }
        }

        if (payload && payload.sub) {
          // Try to find real user for seed token
          const user = await this.usersService.findById(payload.sub);
          if (user && user.status === 'active') {
            return this.login(user);
          } else {
            // If user not found, return new seed token for development
            return {
              access_token: btoa(JSON.stringify({
                sub: payload.sub,
                email: payload.email,
                role: payload.role,
                permissions: payload.permissions || []
              })),
              refresh_token: btoa(JSON.stringify({
                sub: payload.sub,
                email: payload.email,
                role: payload.role,
                permissions: payload.permissions || []
              })),
              user: {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                permissions: payload.permissions || []
              }
            };
          }
        }

        throw jwtError;
      } catch (seedError) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
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