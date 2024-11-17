import { Type } from 'class-transformer';
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
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;

  @IsIn(['active', 'inactive'])
  status: string;
}
