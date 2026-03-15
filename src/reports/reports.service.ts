import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  findAll(): Promise<Report[]> {
    return this.reportsRepository.find();
  }

  findOne(id: number): Promise<Report> {
    return this.reportsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.reportsRepository.delete(id);
  }
}
