import { IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['pending', 'in-progress', 'completed'])
  @IsOptional()
  status?: 'pending' | 'in-progress' | 'completed';

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  dueTime?: string;

  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  priority?: 'low' | 'medium' | 'high';

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  assignedToId?: number;
}
