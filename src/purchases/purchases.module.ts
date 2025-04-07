import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PurchaseHelperService } from './purchases.helper.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PurchasesController],
  providers: [PurchasesService, PurchaseHelperService],
})
export class PurchasesModule { }
