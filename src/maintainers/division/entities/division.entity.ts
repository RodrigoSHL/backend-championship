import { Association } from 'src/maintainers/association/entities/association.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Division {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  level: string;

  @Column()
  description: string;

  @ManyToOne(() => Association, (association) => association.divisions)
  association: Association;
}
