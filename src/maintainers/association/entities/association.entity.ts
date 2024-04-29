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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ name: 'founding_year' })
  foundingYear: number;

  @Column()
  president: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => Client, (client) => client.associations)
  client: Client;

  @OneToMany(() => Division, (division) => division.association)
  divisions: Division[];
}
