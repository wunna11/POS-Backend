import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsPositive, Min, ValidateNested } from "class-validator";


export class CreatePurchaseDto {
  taxAmount: number;

  @IsNotEmpty()
  medicines: Array<{
    id: number;
    name: string;
    quantity: number;
  }>;
}

export function normalizeMedicineInput(input: any): CreatePurchaseDto {
  let medicines = input.medicines;
  
  // If medicines is an array with a single string element
  if (Array.isArray(medicines) && medicines.length === 1 && typeof medicines[0] === 'string') {
    try {
      medicines = JSON.parse(medicines[0]);
    } catch (e) {
      throw new Error('Invalid medicines JSON string');
    }
  }
  
  return {
    taxAmount: input.taxAmount,
    medicines
  };
}
