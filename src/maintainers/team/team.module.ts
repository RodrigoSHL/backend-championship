import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Division } from '../division/entities/division.entity';
import { Team } from './entities/team.entity';

@Module({
  controllers: [TeamController],
  providers: [TeamService],
  imports: [TypeOrmModule.forFeature([Division, Team])],
})
export class TeamModule {}
