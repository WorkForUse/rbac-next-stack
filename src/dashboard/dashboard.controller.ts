import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  @Get('stats')
  async getStats() {
    return { 
      leads: 0, 
      tasks: 0, 
      users: 0 
    };
  }
}