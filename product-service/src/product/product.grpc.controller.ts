import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  DecreaseStockRequest,
  FindOneRequest,
  FindRequest,
} from './interfaces/product-service-grpc.interface';

@Controller()
export class ProductGrpcController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductsService', 'FindOne')
  findOne(req: FindOneRequest) {
    return this.productService.findOne(req.id);
  }
  @GrpcMethod('ProductsService', 'FindByIds')
  async findByIds(ids: FindRequest) {
    const items = await this.productService.findByIds(ids.ids);
    const formattedProducts = items.map((item) => ({
      id: item._id.toString(),
      name: item.name || '',
      price: item.price || 0,
      category: item.category || '',
      description: item.description || '',
      stock: String(item.stock || '0'),
    }));
    return { products: formattedProducts };
  }
  @GrpcMethod('ProductsService', 'DecreaseStock')
  async decreaseStock(request: DecreaseStockRequest) {
    const item = await this.productService.decreaseStock(
      request.id,
      request.quantity,
    );
    const product = {
      id: item._id.toString(),
      name: item.name || '',
      price: item.price || 0,
      category: item.category || '',
      description: item.description || '',
      stock: String(item.stock || '0'),
    };
    return product;
  }
}
