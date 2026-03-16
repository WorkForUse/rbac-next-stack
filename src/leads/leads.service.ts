import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { User } from '../users/entities/user.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.leadsRepository.find({ 
      relations: ['assignedTo'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number) {
    const lead = await this.leadsRepository.findOne({
      where: { id },
      relations: ['assignedTo'],
    });
    if (!lead) throw new NotFoundException(`Lead #${id} not found`);
    return lead;
  }

  async create(createLeadDto: CreateLeadDto) {
    let assignedTo = null;
    
    if (createLeadDto.assignedToId) {
      assignedTo = await this.usersRepository.findOne({
        where: { id: createLeadDto.assignedToId }
      });
      if (!assignedTo) {
        throw new BadRequestException(`User with ID ${createLeadDto.assignedToId} not found`);
      }
    }

    const lead = this.leadsRepository.create({
      ...createLeadDto,
      assignedTo,
      status: createLeadDto.status || 'new',
    });
    return this.leadsRepository.save(lead);
  }

  async update(id: number, updateLeadDto: UpdateLeadDto) {
    const lead = await this.findOne(id);
    
    if (updateLeadDto.assignedToId) {
      const user = await this.usersRepository.findOne({
        where: { id: updateLeadDto.assignedToId }
      });
      if (!user) {
        throw new BadRequestException(`User with ID ${updateLeadDto.assignedToId} not found`);
      }
      lead.assignedTo = user;
    } else if (updateLeadDto.assignedToId === null) {
      lead.assignedTo = null;
    }
    
    Object.assign(lead, { ...updateLeadDto, assignedTo: undefined });
    return this.leadsRepository.save(lead);
  }

  async assignLead(leadId: number, userId: number) {
    const lead = await this.findOne(leadId);
    const user = await this.usersRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }

    lead.assignedTo = user;
    return this.leadsRepository.save(lead);
  }

  async unassignLead(leadId: number) {
    const lead = await this.findOne(leadId);
    lead.assignedTo = null;
    return this.leadsRepository.save(lead);
  }

  async remove(id: number) {
    const lead = await this.findOne(id);
    return this.leadsRepository.remove(lead);
  }
}
