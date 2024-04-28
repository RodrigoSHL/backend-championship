import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Association } from './entities/association.entity';
import { Repository } from 'typeorm';
import { Client } from '../client/entities/client.entity';

@Injectable()
export class AssociationService {
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

    const association = this.associationsRepository.create({
      ...createAssociationDto,
      client,
    });

    return this.associationsRepository.save(association);
  }

  findAll() {
    return `This action returns all association`;
  }

  findOne(id: number) {
    return `This action returns a #${id} association`;
  }

  update(id: number, updateAssociationDto: UpdateAssociationDto) {
    return `This action updates a #${id} association`;
  }

  remove(id: number) {
    return `This action removes a #${id} association`;
  }
}
