export interface ProductsService {
  findOne(data: FindOneRequest): Product;
}

export interface FindOneRequest {
  id: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}
