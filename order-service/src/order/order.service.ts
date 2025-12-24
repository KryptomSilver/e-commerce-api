import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { ProductsGrpcService } from './interfaces/product-service.interface';

@Injectable()
export class OrderService implements OnModuleInit {
  private productServiceGrpc: ProductsGrpcService;
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject('PRODUCT_PACKAGE')
    private readonly productService: ClientGrpc,
    private dataSource: DataSource,
  ) {}
  onModuleInit() {
    this.productServiceGrpc =
      this.productService.getService<ProductsGrpcService>('ProductsService');
  }

  async create(createOrderDto: CreateOrderDto) {
    const productIds = createOrderDto.orderItems.map(
      (orderItem) => orderItem.productId,
    );
    const responseProducts = await lastValueFrom(
      this.productServiceGrpc.findByIds({ ids: productIds }),
    );
    const products = responseProducts?.products ?? [];
    return await this.dataSource.transaction(async (manager) => {
      const newOrder = new Order();
      newOrder.orderNumber = createOrderDto.orderNumber;
      newOrder.createdAt = createOrderDto.createdAt;
      newOrder.userId = createOrderDto.userId;
      newOrder.status = createOrderDto.status;

      if (products.length !== productIds.length) {
        throw new NotFoundException('One or more products not found');
      }

      let totalAmount = 0;
      newOrder.orderItems = createOrderDto.orderItems.map((item) => {
        const orderItem = new OrderItem();
        const product = products.find((prod) => prod.id === item.productId);
        console.log(product, item.productId, products);
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }
        orderItem.productId = item.productId;
        orderItem.quantity = product.stock >= item.quantity ? item.quantity : 0;
        orderItem.price = product.price;
        totalAmount += product.price * item.quantity;
        return orderItem;
      });
      newOrder.totalAmount = totalAmount;
      const savedOrder = await manager.save(Order, newOrder);
      const response = {
        data: savedOrder,
        message: 'Order created successfully',
      };
      return response;
    });
  }

  async findAll() {
    const orders = await this.orderRepository.find({
      relations: {
        orderItems: true,
      },
    });
    return orders;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
