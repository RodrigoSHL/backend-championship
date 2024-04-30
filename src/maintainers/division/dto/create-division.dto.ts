import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

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
  updateAt?: Date;

  @IsNotEmpty()
  @IsInt()
  associationId: string;
}
