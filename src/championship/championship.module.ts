import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChampionshipService } from './championship.service';
import { ChampionshipController } from './championship.controller';
import { Championship } from './entities/championship.entity';
import { Division } from '../maintainers/division/entities/division.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Championship, Division])],
  controllers: [ChampionshipController],
  providers: [ChampionshipService],
})
export class ChampionshipModule {}
