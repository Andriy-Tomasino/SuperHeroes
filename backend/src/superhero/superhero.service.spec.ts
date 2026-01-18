import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuperheroService } from './superhero.service';
import { Superhero } from './entities/superhero.entity';
import { SuperheroImage } from './entities/superhero-image.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('SuperheroService', () => {
  let service: SuperheroService;
  let superheroRepository: Repository<Superhero>;
  let imageRepository: Repository<SuperheroImage>;

  const mockSuperheroRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockImageRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuperheroService,
        {
          provide: getRepositoryToken(Superhero),
          useValue: mockSuperheroRepository,
        },
        {
          provide: getRepositoryToken(SuperheroImage),
          useValue: mockImageRepository,
        },
      ],
    }).compile();

    service = module.get<SuperheroService>(SuperheroService);
    superheroRepository = module.get<Repository<Superhero>>(
      getRepositoryToken(Superhero),
    );
    imageRepository = module.get<Repository<SuperheroImage>>(
      getRepositoryToken(SuperheroImage),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a superhero', async () => {
      const createDto = {
        nickname: 'Superman',
        real_name: 'Clark Kent',
        origin_description: 'Born on Krypton',
        superpowers: 'Flight, super strength',
        catch_phrase: 'Up, up and away!',
      };

      const expectedSuperhero = {
        id: 1,
        ...createDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSuperheroRepository.create.mockReturnValue(createDto);
      mockSuperheroRepository.save.mockResolvedValue(expectedSuperhero);

      const result = await service.create(createDto);

      expect(mockSuperheroRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockSuperheroRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedSuperhero);
    });
  });

  describe('findAll', () => {
    it('should return paginated superheroes with first image', async () => {
      const mockSuperheroes = [
        {
          id: 1,
          nickname: 'Superman',
          images: [
            { id: 1, path: 'image1.jpg' },
            { id: 2, path: 'image2.jpg' },
          ],
        },
        {
          id: 2,
          nickname: 'Batman',
          images: [{ id: 3, path: 'image3.jpg' }],
        },
      ];

      mockSuperheroRepository.findAndCount.mockResolvedValue([
        mockSuperheroes,
        2,
      ]);

      const result = await service.findAll(1, 5);

      expect(result.data).toHaveLength(2);
      expect(result.data[0].image).toEqual(mockSuperheroes[0].images[0]);
      expect(result.data[1].image).toEqual(mockSuperheroes[1].images[0]);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(5);
    });
  });

  describe('findOne', () => {
    it('should return a superhero by id', async () => {
      const mockSuperhero = {
        id: 1,
        nickname: 'Superman',
        real_name: 'Clark Kent',
        images: [],
      };

      mockSuperheroRepository.findOne.mockResolvedValue(mockSuperhero);

      const result = await service.findOne(1);

      expect(result).toEqual(mockSuperhero);
      expect(mockSuperheroRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['images'],
      });
    });

    it('should throw NotFoundException if superhero not found', async () => {
      mockSuperheroRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a superhero', async () => {
      const existingSuperhero = {
        id: 1,
        nickname: 'Superman',
        real_name: 'Clark Kent',
      };

      const updateDto = {
        nickname: 'Superman Updated',
      };

      const updatedSuperhero = {
        ...existingSuperhero,
        ...updateDto,
      };

      mockSuperheroRepository.findOne.mockResolvedValue(existingSuperhero);
      mockSuperheroRepository.save.mockResolvedValue(updatedSuperhero);

      const result = await service.update(1, updateDto);

      expect(result.nickname).toBe('Superman Updated');
      expect(mockSuperheroRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a superhero', async () => {
      const mockSuperhero = {
        id: 1,
        nickname: 'Superman',
        images: [],
      };

      mockSuperheroRepository.findOne.mockResolvedValue(mockSuperhero);
      mockSuperheroRepository.remove.mockResolvedValue(mockSuperhero);

      await service.remove(1);

      expect(mockSuperheroRepository.remove).toHaveBeenCalledWith(
        mockSuperhero,
      );
    });
  });
});
