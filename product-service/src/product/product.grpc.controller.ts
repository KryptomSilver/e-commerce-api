import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { GrpcMethod } from '@nestjs/microservices';
import { FindOneRequest } from './interfaces/product-service-grpc.interface';

@Controller()
export class ProductGrpcController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductsService', 'FindOne')
  findOne(req: FindOneRequest) {
    return this.productService.findOne(req.id);
  }
}
