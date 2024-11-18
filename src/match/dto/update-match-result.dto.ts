import { IsInt, IsOptional } from 'class-validator';

export class UpdateMatchResultDto {
  @IsInt()
  @IsOptional()
  homeScore?: number;

  @IsInt()
  @IsOptional()
  awayScore?: number;
}
