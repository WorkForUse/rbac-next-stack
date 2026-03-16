import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsEnum(['active', 'suspended', 'banned'])
  @IsNotEmpty()
  status?: 'active' | 'suspended' | 'banned' = 'active';
}
