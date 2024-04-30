import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  shield: string;

  @IsNotEmpty()
  @IsBoolean()
  state: boolean;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updateAt?: Date;

  @IsNotEmpty()
  @IsString()
  divisionId: string;
}
