import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Association } from '../association/entities/association.entity';
import { Repository } from 'typeorm';
import { Division } from './entities/division.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class DivisionService {
  private readonly logger = new Logger('DivisionService');

  constructor(
    @InjectRepository(Association)
    private associationsRepository: Repository<Association>,
    @InjectRepository(Division)
    private divisionsRepository: Repository<Division>,
  ) {}

  async create(createDivisionDto: CreateDivisionDto) {
    const association = await this.associationsRepository.findOne({
      where: { id: createDivisionDto.associationId },
    });
    if (!association) {
      throw new Error('Association not found');
    }

    try {
      const date = new Date();
      createDivisionDto.createdAt = date;
      const division = this.divisionsRepository.create({
        ...createDivisionDto,
        association,
      });
      await this.divisionsRepository.save(division);
      return division;
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.associationsRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(term: string) {
    let division: Division;
    if (isUUID(term)) {
      division = await this.divisionsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.divisionsRepository.createQueryBuilder();
      division = await queryBuilder
        .where('UPPER(name) =:name', {
          name: term.toUpperCase(),
        })
        .getOne();
    }

    if (!division)
      throw new NotFoundException(`Association with ${term} not found`);

    return division;
  }

  async update(
    id: string,
    updateDivisionDto: UpdateDivisionDto,
  ): Promise<Division> {
    const division = await this.findOne(id);
    if (!division) {
      throw new NotFoundException('Division not found');
    }

    if (updateDivisionDto.associationId) {
      const association = await this.associationsRepository.findOne({
        where: { id: updateDivisionDto.associationId },
      });
      if (!association) {
        throw new NotFoundException('Association not found');
      }
      division.association = association;
    }

    try {
      Object.assign(division, updateDivisionDto);
      return this.divisionsRepository.save(division);
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const division = await this.findOne(id);
    await this.divisionsRepository.remove(division);
    return division;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
