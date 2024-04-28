import { Module } from '@nestjs/common';
import { AssociationService } from './association.service';
import { AssociationController } from './association.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Association } from './entities/association.entity';
import { Client } from '../client/entities/client.entity';
import { Division } from '../division/entities/division.entity';

@Module({
  controllers: [AssociationController],
  providers: [AssociationService],
  imports: [TypeOrmModule.forFeature([Association, Client, Division])],
})
export class AssociationModule {}
