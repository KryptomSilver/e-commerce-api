import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productRepository: Model<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const createdProduct = new this.productRepository(createProductDto);
    const newProduct =  await createdProduct.save();
    await this.cacheManager.del('all_products');
    return newProduct;
  }

  async findAll() {
    const cacheKey = 'all_products';
    const cachedProducts = await this.cacheManager.get<Product[]>(cacheKey);
    if (cachedProducts) {
      return cachedProducts;
    }
    const productsDB = await this.productRepository.find().exec();
    this.cacheManager.set(cacheKey, productsDB);
    return productsDB;
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
