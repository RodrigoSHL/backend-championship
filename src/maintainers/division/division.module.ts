import { Module } from '@nestjs/common';
import { DivisionService } from './division.service';
import { DivisionController } from './division.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Association } from '../association/entities/association.entity';
import { Division } from './entities/division.entity';

@Module({
  controllers: [DivisionController],
  providers: [DivisionService],
  imports: [TypeOrmModule.forFeature([Association, Division])],
})
export class DivisionModule {}
