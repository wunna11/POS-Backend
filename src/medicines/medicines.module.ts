import { Module } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MedicineHelperService } from './medicine.helper.service';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  controllers: [MedicinesController],
  providers: [MedicinesService, MedicineHelperService, ConfigService],
})
export class MedicinesModule { }
