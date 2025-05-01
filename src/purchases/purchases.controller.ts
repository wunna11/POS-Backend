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
}
