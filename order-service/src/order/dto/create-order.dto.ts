export class CreateOrderDto {
  id: number;
  orderNumber: string;
  totalAmount: number;
  createdAt: Date;
  userId: number;
  status: string;
  orderItems: ItemDto[];
}
export class ItemDto {
  productId: number;
  quantity: number;
  price: number;
}
