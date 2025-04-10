import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './response/response.interceptor';
import { MedicinesModule } from './medicines/medicines.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PurchasesModule } from './purchases/purchases.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    AuthModule, UsersModule, CategoriesModule, DatabaseModule, MedicinesModule, ConfigModule.forRoot(), CloudinaryModule, PurchasesModule, TransactionsModule],
  controllers: [
    AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }
