import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Superhero } from './superhero.entity';

@Entity('superhero_images')
export class SuperheroImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  filename: string;

  @Column({ type: 'varchar', length: 500 })
  path: string;

  @Column({ type: 'varchar', length: 100 })
  mimetype: string;

  @Column({ type: 'int' })
  size: number;

  @ManyToOne(() => Superhero, (superhero) => superhero.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'superhero_id' })
  superhero: Superhero;

  @Column({ name: 'superhero_id' })
  superhero_id: number;

  @CreateDateColumn()
  created_at: Date;
}
