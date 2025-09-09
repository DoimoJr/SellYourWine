import { IsString, IsNumber, Min, IsUUID } from 'class-validator';
import { Product, Seller, ProductImage, Inventory } from '../types/database';

export class AddToCartDto {
  @IsString()
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  quantity: number;
}

// Response DTOs
export interface CartItemResponse {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product & {
    seller: Seller;
    images: ProductImage[];
    inventory?: Inventory;
  };
}

export interface CartResponse {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  items: CartItemResponse[];
  subtotalCents: number;
  itemsCount: number;
}