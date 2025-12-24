import { IsArray, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateOrderDto {
  id: number;
  orderNumber: string;
  totalAmount: number;
  createdAt: Date;
  userId: number;
  status: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  orderItems: ItemDto[];
}
export class ItemDto {
  @IsMongoId()
  productId: string;
  quantity: number;
}
