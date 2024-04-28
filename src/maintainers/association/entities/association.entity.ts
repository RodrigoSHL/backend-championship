import { Client } from 'src/maintainers/client/entities/client.entity';
import { Division } from 'src/maintainers/division/entities/division.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Association {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ name: 'founding_year' })
  foundingYear: number;

  @Column()
  president: string;

  @ManyToOne(() => Client, (client) => client.associations)
  client: Client;

  @OneToMany(() => Division, (division) => division.association)
  divisions: Division[];
}
