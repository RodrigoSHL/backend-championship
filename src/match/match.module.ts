import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Championship } from '../championship/entities/championship.entity';
import { Team } from '../maintainers/team/entities/team.entity';
import { Match } from './entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Championship, Team])],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
