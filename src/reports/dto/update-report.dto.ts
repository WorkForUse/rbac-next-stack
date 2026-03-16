import { IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateReportDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(['daily', 'weekly', 'monthly'])
  @IsOptional()
  type?: 'daily' | 'weekly' | 'monthly';
}
