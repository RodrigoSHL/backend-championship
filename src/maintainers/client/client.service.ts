import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ClientService {
  private readonly logger = new Logger('ClientService');

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.clientRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    try {
      const date = new Date();
      createClientDto.createdAt = date;
      createClientDto.email = createClientDto.email.toLowerCase().trim();
      const client = this.clientRepository.create(createClientDto);
      await this.clientRepository.save(client);
      return client;
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    let client: Client;
    console.log('term', term);
    if (isUUID(term)) {
      client = await this.clientRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.clientRepository.createQueryBuilder();
      client = await queryBuilder
        .where('UPPER(name) =:name or email =:email', {
          name: term.toUpperCase(),
          email: term.toLowerCase(),
        })
        .getOne();
    }

    if (!client) throw new NotFoundException(`Product with ${term} not found`);

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.clientRepository.preload({
      id: id,
      ...updateClientDto,
    });

    if (!client) throw new NotFoundException(`Client with id: ${id} not found`);

    try {
      await this.clientRepository.save(client);
      return client;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
    return client;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
