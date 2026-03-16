import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ 
      relations: ['assignedTo'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignedTo']
    });
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    let assignedTo = null;
    
    if (createTaskDto.assignedToId) {
      assignedTo = await this.usersRepository.findOne({
        where: { id: createTaskDto.assignedToId }
      });
      if (!assignedTo) {
        throw new BadRequestException(`User with ID ${createTaskDto.assignedToId} not found`);
      }
    }

    const task = this.tasksRepository.create({
      ...createTaskDto,
      assignedTo,
      status: createTaskDto.status || 'pending',
    });
    return this.tasksRepository.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    
    if (updateTaskDto.assignedToId) {
      const user = await this.usersRepository.findOne({
        where: { id: updateTaskDto.assignedToId }
      });
      if (!user) {
        throw new BadRequestException(`User with ID ${updateTaskDto.assignedToId} not found`);
      }
      task.assignedTo = user;
    } else if (updateTaskDto.assignedToId === null) {
      task.assignedTo = null;
    }

    Object.assign(task, { ...updateTaskDto, assignedToId: undefined });
    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
