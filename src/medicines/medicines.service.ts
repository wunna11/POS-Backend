import { Injectable } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { DatabaseService } from 'src/database/database.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FindAllMedicinesParams } from './dto/medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  @UseInterceptors(FileInterceptor('image'))
  async create(createMedicineDto: CreateMedicineDto, file: Express.Multer.File) {
    const { quantity, price, discountPrice, isDiscount, categoryId } = createMedicineDto;

    const getCategoryId = await this.databaseService.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    })

    if (!getCategoryId) throw new Error('Category Id not found!');

    const image = await this.cloudinaryService.uploadImage(file, 'medicine');
    const data = {
      ...createMedicineDto,
      quantity: Number(quantity),
      price: Number(price),
      discountPrice: Number(discountPrice),
      isDiscount: Boolean(isDiscount),
      expireDate: new Date(),
      categoryId: Number(categoryId),
      image: image.secure_url
    };
    return await this.databaseService.medicine.create({ data });
  }

  async findAll(params: FindAllMedicinesParams) {
    const { name, page = 1, limit = 10 } = params;
    return await this.databaseService.medicine.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined
      },
      skip: page - 1,
      take: limit,
    });
  }

  async findOne(id: number) {
    return await this.databaseService.medicine.findUnique({ where: { id } })
  }

  @UseInterceptors(FileInterceptor('image'))
  async update(id: number, updateMedicineDto: UpdateMedicineDto, file: Express.Multer.File) {
    let updateImage, checkCategoryId;
    const { quantity, price, discountPrice, isDiscount, expireDate, categoryId } = updateMedicineDto;

    const getMedicineId = await this.databaseService.medicine.findUnique({ where: { id } })
    if (!getMedicineId) throw new Error('Medicine Id not Found!')

    if (categoryId) {
      checkCategoryId = await this.databaseService.category.findUnique({
        where: {
          id: Number(categoryId),
        },
      })
    }
    if (categoryId && !checkCategoryId) throw new Error('Category Id not found!');
    if (file) {
      await this.cloudinaryService.deleteImageByUrl(getMedicineId.image);
      updateImage = await this.cloudinaryService.uploadImage(file, 'medicine');
    }

    const data = {
      ...updateMedicineDto,
      quantity: Number(price),
      price: Number(price),
      discountPrice: discountPrice && Number(discountPrice),
      isDiscount: isDiscount && Boolean(isDiscount),
      expireDate: expireDate && new Date(),
      categoryId: categoryId && Number(categoryId),
      image: file && updateImage.secure_url
    }

    return this.databaseService.medicine.update({ where: { id }, data: data })
  }

  async remove(id: number) {
    const existingID = await this.databaseService.medicine.findUnique({ where: { id } });
    if (!existingID) throw new Error('Medicine Id not Found!')
    const result = await this.databaseService.medicine.delete({ where: { id } });
    await this.cloudinaryService.deleteImageByUrl(result.image);
    return 'delete'
  }
}
