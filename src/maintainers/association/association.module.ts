import { Module } from '@nestjs/common';
import { AssociationService } from './association.service';
import { AssociationController } from './association.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Association } from './entities/association.entity';

@Module({
  controllers: [AssociationController],
  providers: [AssociationService],
  imports: [TypeOrmModule.forFeature([Association])],
})
export class AssociationModule {}
