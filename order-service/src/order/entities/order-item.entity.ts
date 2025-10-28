import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  productId: number;
  @Column()
  quantity: number;
  @Column('decimal')
  price: number;
  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
}
