// client.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.clientService.findAll(paginationDto);
  }

  @Get(':term')
  async findOne(@Param('term') term: string) {
    return this.clientService.findOne(term);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
