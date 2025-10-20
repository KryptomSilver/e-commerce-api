import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductHttpController } from './product.http.controller';
import { Product, ProductSchema } from './entities/product.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductGrpcController } from './product.grpc.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductHttpController, ProductGrpcController],
  providers: [ProductService],
})
export class ProductModule {}
