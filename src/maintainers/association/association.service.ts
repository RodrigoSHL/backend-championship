import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Association } from './entities/association.entity';
import { Repository } from 'typeorm';
import { Client } from '../client/entities/client.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class AssociationService {
  private readonly logger = new Logger('ClientService');

  constructor(
    @InjectRepository(Association)
    private associationsRepository: Repository<Association>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(
    createAssociationDto: CreateAssociationDto,
  ): Promise<Association> {
    const client = await this.clientsRepository.findOne({
      where: { id: createAssociationDto.client },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    try {
      const date = new Date();
      createAssociationDto.createdAt = date;
      const association = this.associationsRepository.create({
        ...createAssociationDto,
        client,
      });
      await this.associationsRepository.save(association);
      return association;
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
    let association: Association;
    if (isUUID(term)) {
      association = await this.associationsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.associationsRepository.createQueryBuilder();
      association = await queryBuilder
        .where('UPPER(name) =:name', {
          name: term.toUpperCase(),
        })
        .getOne();
    }

    if (!association)
      throw new NotFoundException(`Association with ${term} not found`);

    return association;
  }

  async update(
    id: string,
    updateAssociationDto: UpdateAssociationDto,
  ): Promise<Association> {
    const association = await this.findOne(id);
    if (!association) {
      throw new NotFoundException('Association not found');
    }

    if (updateAssociationDto.clientId) {
      const client = await this.clientsRepository.findOne({
        where: { id: updateAssociationDto.clientId },
      });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      association.client = client;
    }

    try {
      Object.assign(association, updateAssociationDto);
      return this.associationsRepository.save(association);
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const association = await this.findOne(id);
    await this.associationsRepository.remove(association);
    return association;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
