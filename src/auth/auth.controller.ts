import { 
  Controller, Post, Body, Req, Res, Get, UseGuards, 
  UnauthorizedException, SetMetadata 
} from '@nestjs/common';
import express from 'express';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('signup')
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async signup(@Body() signupDto: SignupDto, @Res({ passthrough: true }) res: express.Response) {
    const createUserDto: CreateUserDto = {
      name: signupDto.name,
      email: signupDto.email,
      password: signupDto.password,
      status: 'active'
    };

    // Map role name to roleId if provided
    if (signupDto.role) {
      const role = await this.usersService.findRoleByName(signupDto.role);
      if (role) {
        createUserDto.roleId = role.id;
      }
    }

    const user = await this.usersService.create(createUserDto);
    const { access_token, refresh_token, user: userData } = await this.authService.login(user as any);
    
    res.cookie('accessToken', access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('refreshToken', refresh_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
    return { 
      message: 'Signup successful',
      user: userData,
      accessToken: access_token 
    };
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
    const user = await this.usersService.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const { access_token, refresh_token, user: userData } = await this.authService.login(user as any);
    
    res.cookie('accessToken', access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.cookie('refreshToken', refresh_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
    return { 
      message: 'Login successful',
      user: userData,
      accessToken: access_token 
    };
  }

  @Post('refresh')
  async refresh(@Req() req: express.Request, @Res({ passthrough: true }) res: express.Response) {
    let refreshToken = req.cookies['refreshToken'];
    
    // If no refresh token in cookie, try Authorization header
    if (!refreshToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        refreshToken = authHeader.substring(7);
      }
    }
    
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    // Delegate all token handling to authService
    // It handles both JWT and seed data token cases
    const result = await this.authService.refreshToken(refreshToken);
    res.cookie('accessToken', result.access_token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production' 
    });
    return { access_token: result.access_token };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @SetMetadata('permission', 'view_profile')
  async getProfile(@Req() req: any) {
    console.log('DEBUG /auth/me user:', req.user);
    const result = await this.authService.me(req.user);
    console.log('DEBUG /auth/me result:', result);
    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @SetMetadata('permission', 'manage_self')
  async logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return { message: 'Logged out successfully' };
  }
}