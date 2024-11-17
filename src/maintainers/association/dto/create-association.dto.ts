import { Type } from 'class-transformer';
import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateAssociationDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  foundingYear: number;

  @IsString()
  president: string;

  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;

  @IsString()
  clientId: string;
}
