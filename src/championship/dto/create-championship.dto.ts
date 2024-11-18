import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsUUID,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChampionshipDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  divisions: string[];
}
