import { User } from '../../../auth/entities/user.entity';
import { Association } from 'src/maintainers/association/entities/association.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'client_id', unique: true }) // Tenant field
  clientId: string;

  @Column()
  status: string;

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

  @ManyToOne(() => User, (user) => user.clients, { eager: true })
  user: User;

  @OneToMany(() => Association, (association) => association.client)
  associations: Association[];
}
