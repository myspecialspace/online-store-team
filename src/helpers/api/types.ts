interface PaginationResponse {
  limit: number;
  skip: number;
  total: number;
}

export interface ProductsResponse extends PaginationResponse {
  products: Product[];
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export type ProductResponse = Product;
