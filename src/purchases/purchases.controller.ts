import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto, normalizeMedicineInput } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor()) 
  async create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return await this.purchasesService.create(normalizeMedicineInput(createPurchaseDto));
  }

  @Get()
  findAll() {
    return this.purchasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
    return this.purchasesService.update(+id, updatePurchaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(+id);
  }
}
