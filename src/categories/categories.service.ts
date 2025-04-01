import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) { }

  create(createCategoryDto: CreateCategoryDto) {
    return this.databaseService.category.create({ data: createCategoryDto })
  }

  findAll() {
    return this.databaseService.category.findMany();
  }

  findOne(id: number) {
    return this.databaseService.category.findUnique({
      where: {
        id,
      }
    })
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.databaseService.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    })
  }

  remove(id: number) {
    return this.databaseService.category.delete({
      where: {
        id,
      }
    })
  }
}
