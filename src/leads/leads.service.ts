import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
  ) {}

  findAll() {
    return this.leadsRepository.find({ relations: ['assignedTo'] });
  }

  async findOne(id: number) {
    const lead = await this.leadsRepository.findOne({
      where: { id },
      relations: ['assignedTo'],
    });
    if (!lead) throw new NotFoundException(`Lead #${id} not found`);
    return lead;
  }

  async create(createLeadDto: any) {
    const lead = this.leadsRepository.create(createLeadDto);
    return this.leadsRepository.save(lead);
  }

  async update(id: number, updateLeadDto: any) {
    const lead = await this.findOne(id);
    Object.assign(lead, updateLeadDto);
    return this.leadsRepository.save(lead);
  }

  async remove(id: number) {
    const lead = await this.findOne(id);
    return this.leadsRepository.remove(lead);
  }
}
