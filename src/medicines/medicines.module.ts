import { Module } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  controllers: [MedicinesController],
  providers: [MedicinesService, ConfigService],
})
export class MedicinesModule { }
