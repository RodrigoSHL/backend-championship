import { CreateTeamDto } from './create-team.dto';
import { ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateManyTeamsDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTeamDto)
  teams: CreateTeamDto[];
}
