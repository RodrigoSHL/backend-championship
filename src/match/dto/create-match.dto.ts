import { IsDate, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMatchDto {
  @IsUUID()
  homeTeamId: string;

  @IsUUID()
  awayTeamId: string;

  @IsUUID()
  championshipId: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  location?: string;
}
