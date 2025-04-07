import { IsBoolean, IsDate, isEmpty, isNotEmpty, IsNotEmpty, IsNumber } from "class-validator";

export class CreateMedicineDto {
  @IsNotEmpty()
  name: string;

  image: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  price: number;

  discountPrice: number;

  @IsNotEmpty()
  isDiscount: boolean;

  @IsNotEmpty()
  expireDate: Date;

  @IsNotEmpty()
  categoryId: number
}
