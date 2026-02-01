import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}
export interface FindOneRequest {
  id: string;
}
export interface FindManyRequest {
  ids: string[];
}
export interface ProductList {
  products: Product[];
}
export interface DecreaseStockRequest {
  id: string;
  quantity: number;
}
export interface ProductsGrpcService {
  findOne(data: { id: string }): Observable<Product>;
  findByIds(data: FindManyRequest): Observable<ProductList>;
  decreaseStock(data: DecreaseStockRequest): Observable<Product>;
}
