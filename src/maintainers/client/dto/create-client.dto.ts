import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  clientId: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updateAt?: Date;

  @IsIn(['active', 'inactive'])
  status: string;
}
