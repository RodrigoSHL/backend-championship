import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDivisionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  level: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsNotEmpty()
  @IsString()
  associationId: string;
}
