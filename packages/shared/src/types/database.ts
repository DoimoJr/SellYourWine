// Database enums
export enum OrderStatus {
  PAID = 'paid',
  LABEL_GENERATED = 'label_generated',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum OrderItemStatus {
  PENDING = 'pending',
  LABEL_GENERATED = 'label_generated',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  REFUNDED = 'refunded'
}

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin'
}

// Base entity interfaces
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User related types
export interface User extends BaseEntity {
  email: string;
  password?: string;
  role: UserRole;
}

export interface Address extends BaseEntity {
  userId?: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface Seller extends BaseEntity {
  userId: string;
  displayName: string;
  iban?: string;
}

// Product related types  
export interface Category extends BaseEntity {
  parentId?: string;
  name: string;
  slug: string;
}

export interface Product extends BaseEntity {
  sellerId: string;
  categoryId?: string;
  name: string;
  vintage?: number;
  grapes?: string;
  region?: string;
  alcoholPct?: number;
  description?: string;
  priceCents: number;
  currency: string;
  isActive: boolean;
}

export interface ProductImage extends BaseEntity {
  productId: string;
  url: string;
  position: number;
}

export interface Inventory extends BaseEntity {
  productId: string;
  sku?: string;
  quantity: number;
  managed: boolean;
}

// Order related types
export interface Order extends BaseEntity {
  buyerId?: string;
  status: OrderStatus;
  subtotalCents: number;
  shippingCents: number;
  feeCents: number;
  totalCents: number;
  currency: string;
  paymentMethod?: string;
  stripeSessionId?: string;
  shippingAddressId?: string;
  billingAddressId?: string;
}

export interface OrderItem extends BaseEntity {
  orderId: string;
  productId: string;
  sellerId: string;
  qty: number;
  unitPriceCents: number;
  status: OrderItemStatus;
  labelUrl?: string;
  trackingNumber?: string;
}

export interface Payment extends BaseEntity {
  orderId: string;
  provider: string;
  providerPaymentId?: string;
  status: string;
  capturedCents?: number;
}

// Authentication related types
export interface RefreshToken extends BaseEntity {
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
}

export interface PasswordResetToken extends BaseEntity {
  userId: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
}

// Cart related types
export interface Cart extends BaseEntity {
  userId: string;
}

export interface CartItem extends BaseEntity {
  cartId: string;
  productId: string;
  quantity: number;
}