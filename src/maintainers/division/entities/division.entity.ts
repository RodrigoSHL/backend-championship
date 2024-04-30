import { Association } from 'src/maintainers/association/entities/association.entity';
import { Team } from 'src/maintainers/team/entities/team.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Division {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  level: string;

  @Column()
  description: string;

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

  @ManyToOne(() => Association, (association) => association.divisions)
  association: Association;

  @OneToMany(() => Team, (team) => team.division)
  teams: Team[];
}
