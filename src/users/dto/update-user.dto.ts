import { IsEmail, IsOptional, IsEnum, IsNumber, IsString, MinLength } from 'class-validator';
// import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsEnum(['active', 'suspended', 'banned'])
  status?: 'active' | 'suspended' | 'banned';
}
