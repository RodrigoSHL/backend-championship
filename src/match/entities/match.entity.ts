import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Team } from 'src/maintainers/team/entities/team.entity';
import { Championship } from 'src/championship/entities/championship.entity';

export enum MatchStatus {
  PENDING = 'pending',
  PLAYED = 'played',
  POSTPONED = 'postponed',
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team, { eager: true })
  homeTeam: Team;

  @ManyToOne(() => Team, { eager: true })
  awayTeam: Team;

  @ManyToOne(() => Championship, { eager: false })
  championship: Championship;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'int', nullable: true })
  homeScore: number;

  @Column({ type: 'int', nullable: true })
  awayScore: number;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.PENDING,
  })
  status: MatchStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
