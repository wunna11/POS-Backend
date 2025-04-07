import { BadRequestException, Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class PurchaseHelperService {

  constructor(
    private readonly databaseService: DatabaseService,
  ) { }

  preparePurchaseItems(medicines: any[], medicinesFromDb: any[]) {
    return medicines.map(medicine => {
      const dbMedicine = medicinesFromDb.find(m => m.id === medicine.id);

      if (!medicine.quantity || !Number.isInteger(medicine.quantity)) {
        throw new BadRequestException(`Invalid quantity for medicine ${dbMedicine.name}`);
      }
      if (medicine.quantity <= 0) {
        throw new BadRequestException(`Quantity must be positive for ${dbMedicine.name}`);
      }
      if (medicine.quantity > dbMedicine.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${dbMedicine.name}. ` +
          `Requested: ${medicine.quantity}, Available: ${dbMedicine.quantity}`
        );
      }

      return {
        ...medicine,
        name: dbMedicine.name,
        price: dbMedicine.price,
        currentStock: dbMedicine.quantity
      };
    });
  }

  async getMedicinesFromDb(medicines: any[]) {
    const boughtMedicineIds = medicines.map(item => item.id);
    const medicinesFromDb = await this.databaseService.medicine.findMany({
      where: { id: { in: boughtMedicineIds } },
      select: { id: true, name: true, price: true, quantity: true }
    });

    if (medicinesFromDb.length !== medicines.length) {
      throw new BadRequestException('One or more medicines not found');
    }

    return medicinesFromDb;
  }

  validateInput(taxAmount: number, medicines: any[]) {
    if (taxAmount < 0) {
      throw new BadRequestException('Tax amount cannot be negative');
    }
    if (!medicines || medicines.length === 0) {
      throw new BadRequestException('At least one medicine is required');
    }
  }

  calculateTotals(purchaseItems: any[], taxAmount: number) {
    const subtotal = purchaseItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const totalAmount = subtotal + Number(taxAmount);
    return { subtotal, totalAmount };
  }
}