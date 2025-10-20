import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productRepository: Model<Product>,
  ) {}
  create(createProductDto: CreateProductDto) {
    const createdProduct = new this.productRepository(createProductDto);
    return createdProduct.save();
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    return await this.productRepository.findById(id).exec();
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository
      .findByIdAndUpdate(id, updateProductDto, {
        new: true,
      })
      .exec();
  }

  remove(id: number) {
    return this.productRepository.findByIdAndDelete(id).exec();
  }
}
