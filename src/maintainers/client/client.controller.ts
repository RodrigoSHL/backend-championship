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
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Auth, GetUser } from '../../auth/decorators';
import { ValidRoles } from '../../auth/interfaces';
import { User } from '../../auth/entities/user.entity';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @Auth(ValidRoles.admin)
  async create(
    @Body() createClientDto: CreateClientDto,
    @GetUser() user: User,
  ) {
    return this.clientService.create(createClientDto, user);
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
  @Auth(ValidRoles.admin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
    @GetUser() user: User,
  ) {
    return this.clientService.update(id, updateClientDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  async remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
