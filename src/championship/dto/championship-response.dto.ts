import { Division } from 'src/maintainers/division/entities/division.entity';

export class ChampionshipResponseDto {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  divisions: Division[];
  createdAt: Date;
  updatedAt: Date;
}
