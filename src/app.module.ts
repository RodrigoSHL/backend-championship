import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './maintainers/client/client.module';
import { AssociationModule } from './maintainers/association/association.module';
import { CommonModule } from './common/common.module';
import { DivisionModule } from './maintainers/division/division.module';
import { TeamModule } from './maintainers/team/team.module';
import { CategoryModule } from './maintainers/category/category.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    ClientModule,

    AssociationModule,

    CommonModule,

    DivisionModule,

    TeamModule,

    CategoryModule,

    AuthModule,
  ],
})
export class AppModule {}
