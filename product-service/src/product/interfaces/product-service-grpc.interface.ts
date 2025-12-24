export interface Product{
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
export interface FindRequest {
  ids: string[];
}
export interface ProductList {
  products: Product[];
}
