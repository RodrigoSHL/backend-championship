import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger('CategoryService');

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const date = new Date();
      createCategoryDto.createdAt = date;
      createCategoryDto.name = createCategoryDto.name.toLowerCase().trim();
      const category = this.categoriesRepository.create(createCategoryDto);
      await this.categoriesRepository.save(category);
      return category;
    } catch (error) {
      console.log(error);
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.categoriesRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(term: string) {
    let category: Category;
    if (isUUID(term)) {
      category = await this.categoriesRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.categoriesRepository.createQueryBuilder();
      category = await queryBuilder
        .where('UPPER(name) =:name', {
          name: term.toUpperCase(),
        })
        .getOne();
    }

    if (!category)
      throw new NotFoundException(`Product with ${term} not found`);

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.preload({
      id: id,
      ...updateCategoryDto,
    });

    if (!category)
      throw new NotFoundException(`Category with id: ${id} not found`);

    try {
      await this.categoriesRepository.save(category);
      return category;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
    return category;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
