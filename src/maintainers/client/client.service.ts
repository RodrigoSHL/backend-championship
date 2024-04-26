// client.service.ts
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

@Injectable()
export class ClientService {
  private readonly logger = new Logger('ClientService');

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAll() {
    return this.clientRepository.find();
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
    const client = await this.clientRepository.findOneBy({ id: term });
    if (!client) throw new NotFoundException(`Product with ${term} not found`);

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    client.name = updateClientDto.name;
    client.email = updateClientDto.email;
    client.updatedAt = new Date();
    return this.clientRepository.save(client);
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
