import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { FindAllTransactionsParams } from './dto/transaction.dto';
import { Prisma } from '@prisma/client';
import * as moment from 'moment';

@Injectable()
export class TransactionsService {

  constructor(
    private readonly databaseService: DatabaseService
  ) { }


  async findAll(params: FindAllTransactionsParams) {
    const { day, month, year } = params;
    
    const where: Prisma.TransactionWhereInput = {};
  
    if (year) {
      if (month) {
        if (day) {
          // Filter by specific day
          const startDate = moment([year, month - 1, day]).startOf('day').toDate();
          const endDate = moment([year, month - 1, day]).endOf('day').toDate();
          
          where.date = {
            gte: startDate,
            lte: endDate,
          };
        } else {
          // Filter by month
          const startDate = moment([year, month - 1]).startOf('month').toDate();
          const endDate = moment([year, month - 1]).endOf('month').toDate();
          
          where.date = {
            gte: startDate,
            lte: endDate,
          };
        }
      } else {
        // Filter by entire year
        const startDate = moment([year]).startOf('year').toDate();
        const endDate = moment([year]).endOf('year').toDate();
        where.date = {
          gte: startDate,
          lte: endDate,
        };
      }
    }
  
    console.log('where', where);
    return await this.databaseService.transaction.findMany({ where });
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }
}
