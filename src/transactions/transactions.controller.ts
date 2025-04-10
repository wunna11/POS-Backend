import { Controller, Get, Param, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(
    @Query('day') day?: number,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.transactionsService.findAll({day, month, year});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }
}
