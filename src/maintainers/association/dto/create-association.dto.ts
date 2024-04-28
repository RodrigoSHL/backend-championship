import { IsString, IsInt } from 'class-validator';

export class CreateAssociationDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsInt()
  foundingYear: number;

  @IsString()
  president: string;

  @IsString()
  client: string;
}
