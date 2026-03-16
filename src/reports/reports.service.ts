import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { User } from '../users/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<Report[]> {
    return this.reportsRepository.find({ 
      relations: ['author'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Report> {
    const report = await this.reportsRepository.findOne({
      where: { id },
      relations: ['author']
    });
    if (!report) throw new NotFoundException(`Report #${id} not found`);
    return report;
  }

  async create(createReportDto: CreateReportDto, userId: number): Promise<Report> {
    const author = await this.usersRepository.findOne({
      where: { id: userId }
    });

    const report = this.reportsRepository.create({
      ...createReportDto,
      author,
      type: createReportDto.type || 'monthly',
    });
    return this.reportsRepository.save(report);
  }

  async update(id: number, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.findOne(id);
    Object.assign(report, updateReportDto);
    return this.reportsRepository.save(report);
  }

  async remove(id: number): Promise<void> {
    const report = await this.findOne(id);
    await this.reportsRepository.remove(report);
  }
}
