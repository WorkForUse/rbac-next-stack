import { Controller, Get, Post, Patch, Put, Delete, Param, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { SetMetadata } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @SetMetadata('permission', 'view_tasks')
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @SetMetadata('permission', 'view_tasks')
  findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(+id);
  }

  @Post()
  @SetMetadata('permission', 'manage_tasks')
  create(@Body(ValidationPipe) createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  @SetMetadata('permission', 'manage_tasks')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Put(':id')
  @SetMetadata('permission', 'manage_tasks')
  async updateFull(@Param('id') id: string, @Body(ValidationPipe) updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @SetMetadata('permission', 'manage_tasks')
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(+id);
  }
}
