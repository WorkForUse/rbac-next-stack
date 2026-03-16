import { IsEmail, IsString, IsNotEmpty, IsOptional, IsIn, MinLength } from 'class-validator';

export class SignupDto {
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
  @IsIn(['Admin', 'Manager', 'Agent', 'User', 'Customer'])
  role?: string;
}
