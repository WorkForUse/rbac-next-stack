import { IsString, IsEmail, IsPhoneNumber, IsEnum, IsOptional, IsNumber } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(['new', 'contacted', 'qualified', 'lost'])
  @IsOptional()
  status?: 'new' | 'contacted' | 'qualified' | 'lost';

  @IsNumber()
  @IsOptional()
  assignedToId?: number;
}
