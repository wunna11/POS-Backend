import { Injectable } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MedicinesService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) { }

  async create(createMedicineDto: CreateMedicineDto, file: Express.Multer.File) {
    console.log('file', file);
    const { price, discountPrice, isDiscount, categoryId } = createMedicineDto;

    const getCategoryId = await this.databaseService.medicine.findUnique({
      where: {
        id: Number(categoryId),
      },
    })

    if (!getCategoryId) throw new Error('Category Id not found!');

    const data = {
      ...createMedicineDto,
      price: Number(price),
      discountPrice: Number(discountPrice),
      isDiscount: Boolean(isDiscount),
      expireDate: new Date(),
      categoryId: Number(categoryId),
      image: file.originalname
    };
    return this.databaseService.medicine.create({ data });
  }

  async findAll() {
    //const result = await this.databaseService.medicine.findMany();

    const result = await this.databaseService.medicine.findMany({
      select: {
        id: true,
        name: true,
        // other fields...
        // Exclude the original image field from selection
      }
    }).then(medicines => medicines.map(medicine => ({
      ...medicine,
      image: 'hello'
    })));

    console.log('result', result);
    return this.databaseService.medicine.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} medicine`;
  }

  update(id: number, updateMedicineDto: UpdateMedicineDto) {
    return `This action updates a #${id} medicine`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicine`;
  }
}
