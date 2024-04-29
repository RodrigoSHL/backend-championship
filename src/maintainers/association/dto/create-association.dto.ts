import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateAssociationDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsInt()
  foundingYear: number;

  @IsString()
  president: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updateAt?: Date;

  @IsString()
  client: string;
}
