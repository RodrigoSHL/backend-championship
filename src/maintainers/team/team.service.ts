import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Division } from '../division/entities/division.entity';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class TeamService {
  private readonly logger = new Logger('TeamService');

  constructor(
    @InjectRepository(Division)
    private divisionsRepository: Repository<Division>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const division = await this.divisionsRepository.findOne({
      where: { id: createTeamDto.divisionId },
    });
    if (!division) {
      throw new Error('Division not found');
    }

    try {
      const date = new Date();
      createTeamDto.createdAt = date;
      const team = this.teamsRepository.create({
        ...createTeamDto,
        division,
      });
      await this.teamsRepository.save(team);
      return team;
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.teamsRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(term: string) {
    let team: Team;
    if (isUUID(term)) {
      team = await this.teamsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.teamsRepository.createQueryBuilder();
      team = await queryBuilder
        .where('UPPER(name) =:name', {
          name: term.toUpperCase(),
        })
        .getOne();
    }

    if (!team)
      throw new NotFoundException(`Association with ${term} not found`);

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (updateTeamDto.divisionId) {
      const division = await this.divisionsRepository.findOne({
        where: { id: updateTeamDto.divisionId },
      });
      if (!division) {
        throw new NotFoundException('Division not found');
      }
      team.division = division;
    }

    try {
      Object.assign(team, updateTeamDto);
      return this.teamsRepository.save(team);
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const team = await this.findOne(id);
    await this.teamsRepository.remove(team);
    return team;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
