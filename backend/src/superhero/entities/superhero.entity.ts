import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SuperheroImage } from './superhero-image.entity';

@Entity('superheroes')
export class Superhero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nickname: string;

  @Column({ type: 'varchar', length: 255 })
  real_name: string;

  @Column({ type: 'text' })
  origin_description: string;

  @Column({ type: 'text' })
  superpowers: string;

  @Column({ type: 'text' })
  catch_phrase: string;

  @OneToMany(() => SuperheroImage, (image) => image.superhero, {
    cascade: true,
    eager: false,
  })
  images: SuperheroImage[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
