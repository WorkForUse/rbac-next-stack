import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(['daily', 'weekly', 'monthly'])
  @IsOptional()
  type?: 'daily' | 'weekly' | 'monthly';
}
