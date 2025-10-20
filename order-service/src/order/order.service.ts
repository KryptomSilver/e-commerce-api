import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientGrpc } from '@nestjs/microservices';
import {
  Product,
  ProductsService,
} from './interfaces/product-service.interface';

@Injectable()
export class OrderService implements OnModuleInit {
  private productsService: ProductsService;
  constructor(@Inject('PRODUCT_PACKAGE') private client: ClientGrpc) {}
  onModuleInit() {
    this.productsService =
      this.client.getService<ProductsService>('ProductsService');
  }
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll(){
    const product: Product = this.productsService.findOne({
      id: '68f49cfdeb89f3aca7cf22e8',
    });
    return product;
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
