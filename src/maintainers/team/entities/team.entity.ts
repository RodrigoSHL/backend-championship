import { Category } from 'src/maintainers/category/entities/category.entity';
import { Division } from 'src/maintainers/division/entities/division.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  shield: string;

  @Column()
  state: boolean;

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

  @ManyToOne(() => Division, (division) => division.teams)
  division: Division;

  @ManyToMany(() => Category)
  @JoinTable()
  category: Category[];
}
