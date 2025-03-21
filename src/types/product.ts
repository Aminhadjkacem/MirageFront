// types/product.ts
export interface Product {
  id: number; // Add id field to match API response
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
}