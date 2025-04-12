import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { DatabaseService } from 'src/database/database.service';
import { PurchaseHelperService } from './purchases.helper.service';

@Injectable()
export class PurchasesService {

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helper: PurchaseHelperService
  ) { }

  async create(createPurchaseDto: CreatePurchaseDto) {
    const { taxPercent, medicines } = createPurchaseDto;

    this.helper.validateInput(taxPercent, medicines);
    const medicinesFromDb = await this.helper.getMedicinesFromDb(medicines);
    const purchaseItems = this.helper.preparePurchaseItems(medicines, medicinesFromDb);

    const { totalAmount } = this.helper.calculateTotals(purchaseItems, taxPercent);
    const invoiceNumber = `INV-${Date.now()}`;

    return await this.databaseService.$transaction(async (prisma) => {
      // create purchase
      const purchase = await prisma.purchase.create({
        data: {
          totalAmount,
          taxPercent,
          invoiceNumber,
          date: new Date(),
          status: 'COMPLETED',
        },
      });

      // create purchase detail
      const purchaseDetails = await Promise.all(
        purchaseItems.map((medicine) =>
          prisma.purchaseDetail.create({
            data: {
              purchaseId: purchase.id,
              medicineId: medicine.id,
              quantity: medicine.quantity,
              price: Number(medicine.price), // Assuming fixed price
              totalAmount: medicine.quantity * Number(medicine.price),
            },
          }),
        ),
      )

      // create transaction
      const transaction = await prisma.transaction.create({
        data: {
          totalAmount,
          date: new Date(),
          purchaseId: purchase.id,
          status: 'SUCCESS'
        },
      });

      // update quantity at medicine table
      const updateMedicine = await Promise.all(
        purchaseItems.map((medicine) => {
          const dbMedicine = medicinesFromDb.find(m => m.id === medicine.id);
          if (dbMedicine) {
            return prisma.medicine.update({ where: { id: medicine.id }, data: { quantity: dbMedicine.quantity - medicine.quantity } });
          } else {
            throw new Error('Invalid medicine data: quantity is undefined');
          }
        }),
      )

      return {
        purchase,
        purchaseDetails,
        transaction,
        updateMedicine
      };
    })
  }
}
