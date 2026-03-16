import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          let token = null;
          
          // Try to extract from Authorization header first
          if (request && request.headers && request.headers.authorization) {
            const auth = request.headers.authorization;
            if (auth.startsWith('Bearer ')) {
              token = auth.substring(7);
            }
          }
          
          // Fall back to cookies
          if (!token && request && request.cookies && request.cookies.accessToken) {
            token = request.cookies.accessToken;
          }
          
          return token;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any) {
    // This validate method receives the decoded payload
    // For real JWTs, passport-jwt will decode it
    // For mock tokens, passport-jwt might fail, but passport has a fallback
    
    if (payload && payload.sub) {
      return { 
        sub: payload.sub, 
        userId: payload.sub,
        email: payload.email || 'user@example.com',
        role: payload.role || 'User',
        permissions: payload.permissions || []
      };
    }
    
    throw new UnauthorizedException('Invalid token');
  }
}