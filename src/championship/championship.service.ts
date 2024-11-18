import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Championship } from './entities/championship.entity';
import { CreateChampionshipDto } from './dto/create-championship.dto';
import { Division } from 'src/maintainers/division/entities/division.entity';

@Injectable()
export class ChampionshipService {
  constructor(
    @InjectRepository(Championship)
    private championshipRepository: Repository<Championship>,
    @InjectRepository(Division)
    private divisionRepository: Repository<Division>,
  ) {}

  async create(
    createChampionshipDto: CreateChampionshipDto,
  ): Promise<Championship> {
    const { divisions, ...championshipData } = createChampionshipDto;

    // Validar divisiones
    const foundDivisions = await this.divisionRepository.findByIds(divisions);
    if (foundDivisions.length !== divisions.length) {
      throw new NotFoundException('One or more divisions not found');
    }

    // Crear el campeonato
    const championship = this.championshipRepository.create({
      ...championshipData,
      divisions: foundDivisions,
    });

    return this.championshipRepository.save(championship);
  }

  async findAll(): Promise<Championship[]> {
    return this.championshipRepository.find({ relations: ['divisions'] });
  }
}
