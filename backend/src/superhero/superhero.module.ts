import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperheroService } from './superhero.service';
import { SuperheroController } from './superhero.controller';
import { Superhero } from './entities/superhero.entity';
import { SuperheroImage } from './entities/superhero-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Superhero, SuperheroImage])],
  controllers: [SuperheroController],
  providers: [SuperheroService],
  exports: [SuperheroService],
})
export class SuperheroModule {}
