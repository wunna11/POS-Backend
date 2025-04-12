import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ParseFilePipeBuilder, HttpStatus, ParseIntPipe } from '@nestjs/common';
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
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /image\/(jpeg|png|jpg)/,
        })
        .addMaxSizeValidator({
          maxSize: 1000 * 1024, // 1000KB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true, // Optional: set to false if file is optional
        }),
    )
    file: Express.Multer.File
  ) {
    return await this.medicinesService.create(createMedicineDto, file);
  }

  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const data = await this.medicinesService.findAll({
      name,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 5
    });

    return {
      result: data,
      pagination: {
        totalCount: data.length,
        page,
        limit,
        totalPages: limit && Math.ceil(data.length / limit),
      }
    };
  }

  @Get('best-selling-item-list')
  async bestSellingItemList(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.medicinesService.getBestSellingItemList({startDate, endDate})
  }

  @Get(':id') 
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.medicinesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /image\/(jpeg|png|jpg)/,
        })
        .addMaxSizeValidator({
          maxSize: 1000 * 1024, // 1000KB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true, // Optional: set to false if file is optional
        }),
    )
    file: Express.Multer.File
  ) {
    return await this.medicinesService.update(+id, updateMedicineDto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.medicinesService.remove(+id);
  }
}
