import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChampionshipService } from './championship.service';
import { CreateChampionshipDto } from './dto/create-championship.dto';

@Controller('championships')
export class ChampionshipController {
  constructor(private readonly championshipService: ChampionshipService) {}

  @Post()
  async create(@Body() createChampionshipDto: CreateChampionshipDto) {
    return this.championshipService.create(createChampionshipDto);
  }

  @Get()
  async findAll() {
    return this.championshipService.findAll();
  }
}
