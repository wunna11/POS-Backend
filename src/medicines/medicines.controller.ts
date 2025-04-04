import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('medicines')
export class MedicinesController {
  constructor(
    private readonly medicinesService: MedicinesService
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createMedicineDto: CreateMedicineDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.medicinesService.create(createMedicineDto, file);
  }

  @Get()
  async findAll() {
    return await this.medicinesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.medicinesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(@Param('id') id: string, @Body() updateMedicineDto: UpdateMedicineDto, @UploadedFile() file: Express.Multer.File) {
    return await this.medicinesService.update(+id, updateMedicineDto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.medicinesService.remove(+id);
  }
}
