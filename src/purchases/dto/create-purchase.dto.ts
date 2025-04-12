import { IsNotEmpty } from "class-validator";

export class CreatePurchaseDto {
  taxPercent: number;

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
    taxPercent: input.taxPercent,
    medicines
  };
}
