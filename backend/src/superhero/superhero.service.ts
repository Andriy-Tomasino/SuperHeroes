import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Superhero } from './entities/superhero.entity';
import { SuperheroImage } from './entities/superhero-image.entity';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SuperheroService {
  constructor(
    @InjectRepository(Superhero)
    private superheroRepository: Repository<Superhero>,
    @InjectRepository(SuperheroImage)
    private imageRepository: Repository<SuperheroImage>,
  ) {}

  async create(createSuperheroDto: CreateSuperheroDto): Promise<Superhero> {
    const superhero = this.superheroRepository.create(createSuperheroDto);
    return await this.superheroRepository.save(superhero);
  }

  async findAll(page: number = 1, limit: number = 5) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.superheroRepository.findAndCount({
      relations: ['images'],
      skip,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });

    // Get only first image for each superhero
    const superheroesWithFirstImage = data.map((superhero) => {
      const firstImage =
        superhero.images && superhero.images.length > 0
          ? superhero.images[0]
          : null;
      return {
        id: superhero.id,
        nickname: superhero.nickname,
        image: firstImage,
      };
    });

    return {
      data: superheroesWithFirstImage,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Superhero> {
    const superhero = await this.superheroRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!superhero) {
      throw new NotFoundException(`Superhero with ID ${id} not found`);
    }

    return superhero;
  }

  async update(
    id: number,
    updateSuperheroDto: UpdateSuperheroDto,
  ): Promise<Superhero> {
    const superhero = await this.findOne(id);
    Object.assign(superhero, updateSuperheroDto);
    return await this.superheroRepository.save(superhero);
  }

  async remove(id: number): Promise<void> {
    const superhero = await this.findOne(id);
    
    // Delete all associated images
    if (superhero.images && superhero.images.length > 0) {
      for (const image of superhero.images) {
        await this.removeImage(id, image.id);
      }
    }

    await this.superheroRepository.remove(superhero);
  }

  async addImage(
    id: number,
    file: Express.Multer.File,
  ): Promise<SuperheroImage> {
    const superhero = await this.findOne(id);

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const uploadDir = process.env.UPLOAD_DEST || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Store relative path for serving static files
    const relativePath = `/uploads/${file.filename}`;
    
    const image = this.imageRepository.create({
      filename: file.filename,
      path: relativePath,
      mimetype: file.mimetype,
      size: file.size,
      superhero_id: id,
    });

    return await this.imageRepository.save(image);
  }

  async removeImage(
    superheroId: number,
    imageId: number,
  ): Promise<void> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId, superhero_id: superheroId },
    });

    if (!image) {
      throw new NotFoundException(
        `Image with ID ${imageId} not found for superhero ${superheroId}`,
      );
    }

    // Delete file from filesystem
    const filePath = image.path;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.imageRepository.remove(image);
  }
}
