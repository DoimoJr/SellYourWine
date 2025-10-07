import { ReviewType } from './enums';
import { User } from './user';
import { Wine } from './wine';

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  reviewerId: string;
  targetId: string;
  orderId: string;
  wineId?: string;
  type: ReviewType;

  // Detailed ratings
  communicationRating?: number;
  shippingRating?: number;
  packagingRating?: number;

  // Seller response
  sellerResponse?: string;
  sellerRespondedAt?: Date;

  // Relations
  reviewer: User;
  target?: User;
  wine?: Wine;
  order?: {
    id: string;
    orderNumber: string;
    createdAt: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewRequest {
  orderId: string;
  rating: number;
  comment?: string;
  communicationRating?: number;
  shippingRating?: number;
  packagingRating?: number;
  wineId?: string;
  type?: ReviewType;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
  communicationRating?: number;
  shippingRating?: number;
  packagingRating?: number;
}

export interface RespondToReviewRequest {
  response: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewableOrder {
  id: string;
  orderNumber: string;
  deliveredAt?: Date;
  seller: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  orderItems: Array<{
    id: string;
    quantity: number;
    wine: {
      id: string;
      title: string;
      images: string[];
      annata?: number;
      region?: string;
    };
  }>;
}

