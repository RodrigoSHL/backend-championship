import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DivisionService } from './division.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('division')
export class DivisionController {
  constructor(private readonly divisionService: DivisionService) {}

  @Post()
  create(@Body() createDivisionDto: CreateDivisionDto) {
    return this.divisionService.create(createDivisionDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.divisionService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.divisionService.findOne(term);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDivisionDto: UpdateDivisionDto,
  ) {
    return this.divisionService.update(id, updateDivisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.divisionService.remove(id);
  }
}
