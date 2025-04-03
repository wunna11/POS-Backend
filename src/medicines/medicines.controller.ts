import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('medicines')
export class MedicinesController {
  constructor(
    private readonly medicinesService: MedicinesService,
    private readonly cloudinaryService: CloudinaryService
  ) { }
  
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createMedicineDto: CreateMedicineDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    await this.cloudinaryService.uploadImage(file);
    return await this.medicinesService.create(createMedicineDto, file);
  }

  @Get()
  async findAll() {
    return await this.medicinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicinesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicineDto: UpdateMedicineDto) {
    return this.medicinesService.update(+id, updateMedicineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicinesService.remove(+id);
  }
}
