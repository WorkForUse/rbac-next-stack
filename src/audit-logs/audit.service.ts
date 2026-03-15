import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async logAction(performedBy: string, action: string, details?: string, userId?: string, resourceId?: string) {
    const log = this.auditLogRepository.create({
      performedBy,
      action,
      details,
      userId,
      resourceId,
    });
    return this.auditLogRepository.save(log);
  }

  async findAll(filters?: { userId?: string; action?: string; limit?: number; page?: number }) {
    const { userId, action, limit = 50, page = 1 } = filters || {};
    const skip = (page - 1) * limit;
    return this.auditLogRepository.find({
      where: { ...(userId && { userId }), ...(action && { action }) },
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    return this.auditLogRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async recentLogs(limit: number = 10) {
    return this.auditLogRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['user'],
    });
  }
}