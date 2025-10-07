import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateReviewDto, UpdateReviewDto, RespondToReviewDto, ReviewFiltersDto } from './dto/review.dto';
import { OrderStatus, ReviewType } from '@wine-marketplace/shared';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { orderId, rating, comment, wineId, type } = createReviewDto;

    // Validate order exists and user is the buyer
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        seller: true,
        buyer: true,
        reviews: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Debug log
    console.log('Review validation:', {
      userId,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      orderStatus: order.status,
    });

    // Only buyer can review
    if (order.buyerId !== userId) {
      throw new ForbiddenException('Only the buyer can review this order');
    }

    // Order must be delivered
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Can only review delivered orders');
    }

    // Check if already reviewed
    const existingReview = order.reviews.find(r => r.reviewerId === userId);
    if (existingReview) {
      throw new ConflictException('You have already reviewed this order');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        reviewerId: userId,
        targetId: order.sellerId,
        orderId,
        rating,
        comment,
        wineId,
        type: type || ReviewType.ORDER_REVIEW,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        target: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update seller rating asynchronously
    this.calculateSellerRating(order.sellerId).catch(err => {
      console.error('Error calculating seller rating:', err);
    });

    return review;
  }

  async findMany(filters: ReviewFiltersDto = {}) {
    const {
      rating,
      sellerId,
      page = 1,
      limit = 20,
    } = filters;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100);

    const where: any = {};

    if (rating) {
      where.rating = rating;
    }

    if (sellerId) {
      where.targetId = sellerId;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          reviewer: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          target: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              createdAt: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        target: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            createdAt: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async getSellerReviews(sellerId: string, filters: ReviewFiltersDto = {}) {
    const {
      rating,
      page = 1,
      limit = 20,
    } = filters;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100);

    const where: any = {
      targetId: sellerId,
    };

    if (rating) {
      where.rating = rating;
    }

    const [reviews, total, seller] = await Promise.all([
      this.prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          reviewer: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
      this.prisma.user.findUnique({
        where: { id: sellerId },
        select: {
          id: true,
          username: true,
          sellerRating: true,
          sellerReviewCount: true,
          sellerResponseRate: true,
        },
      }),
    ]);

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // Calculate rating distribution
    const ratingDistribution = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { targetId: sellerId },
      _count: { rating: true },
    });

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    ratingDistribution.forEach(item => {
      distribution[item.rating] = item._count.rating;
    });

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      seller: {
        id: seller.id,
        username: seller.username,
        averageRating: seller.sellerRating || 0,
        totalReviews: seller.sellerReviewCount || 0,
        responseRate: seller.sellerResponseRate || 0,
      },
      ratingDistribution: distribution,
    };
  }

  async getReviewableOrders(userId: string): Promise<any> {
    // Find delivered orders that haven't been reviewed yet
    const orders = await this.prisma.order.findMany({
      where: {
        buyerId: userId,
        status: OrderStatus.DELIVERED,
        reviews: {
          none: {
            reviewerId: userId,
          },
        },
      },
      orderBy: { deliveredAt: 'desc' },
      take: 50, // Limit to last 50 reviewable orders
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        orderItems: {
          include: {
            wine: {
              select: {
                id: true,
                title: true,
                images: true,
                annata: true,
                region: true,
              },
            },
          },
        },
      },
    });

    return orders;
  }

  async respondToReview(reviewId: string, sellerId: string, respondDto: RespondToReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Only the seller being reviewed can respond
    if (review.targetId !== sellerId) {
      throw new ForbiddenException('You can only respond to reviews about you');
    }

    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        sellerResponse: respondDto.response,
        sellerRespondedAt: new Date(),
      },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Update seller response rate
    this.updateSellerResponseRate(sellerId).catch(err => {
      console.error('Error updating seller response rate:', err);
    });

    return updatedReview;
  }

  async calculateSellerRating(sellerId: string) {
    // Get all reviews for this seller (last 100 for performance)
    const reviews = await this.prisma.review.findMany({
      where: { targetId: sellerId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    if (reviews.length === 0) {
      await this.prisma.user.update({
        where: { id: sellerId },
        data: {
          sellerRating: 0,
          sellerReviewCount: 0,
        },
      });
      return;
    }

    // Calculate weighted rating (recent reviews count more)
    let totalWeight = 0;
    let weightedSum = 0;
    const now = new Date();

    reviews.forEach((review, index) => {
      // Recency weight: exponential decay over 180 days
      const daysSince = (now.getTime() - review.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      const recencyWeight = Math.exp(-daysSince / 180);

      // Position weight: first reviews slightly more important
      const positionWeight = 1 / (1 + index * 0.01);

      const finalWeight = recencyWeight * positionWeight;

      weightedSum += review.rating * finalWeight;
      totalWeight += finalWeight;
    });

    const weightedRating = totalWeight > 0 ? weightedSum / totalWeight : 0;

    await this.prisma.user.update({
      where: { id: sellerId },
      data: {
        sellerRating: weightedRating,
        sellerReviewCount: reviews.length,
      },
    });

    return weightedRating;
  }

  private async updateSellerResponseRate(sellerId: string) {
    const [totalReviews, respondedReviews] = await Promise.all([
      this.prisma.review.count({
        where: { targetId: sellerId },
      }),
      this.prisma.review.count({
        where: {
          targetId: sellerId,
          sellerResponse: { not: null },
        },
      }),
    ]);

    const responseRate = totalReviews > 0 ? (respondedReviews / totalReviews) * 100 : 0;

    await this.prisma.user.update({
      where: { id: sellerId },
      data: { sellerResponseRate: responseRate },
    });

    return responseRate;
  }

  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Only reviewer can update
    if (review.reviewerId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: {
        rating: updateReviewDto.rating,
        comment: updateReviewDto.comment,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        target: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Recalculate seller rating
    this.calculateSellerRating(review.targetId).catch(err => {
      console.error('Error recalculating seller rating:', err);
    });

    return updatedReview;
  }

  async delete(id: string, userId: string, userRole: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Only reviewer or admin can delete
    if (review.reviewerId !== userId && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    // Recalculate seller rating
    this.calculateSellerRating(review.targetId).catch(err => {
      console.error('Error recalculating seller rating:', err);
    });

    return { message: 'Review deleted successfully' };
  }
}
