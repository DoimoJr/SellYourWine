import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, RespondToReviewDto, ReviewFiltersDto } from './dto/review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req, @Body() createReviewDto: CreateReviewDto) {
    const userId = req.user.id;
    return this.reviewsService.create(userId, createReviewDto);
  }

  @Get()
  async findAll(@Query() filters: ReviewFiltersDto) {
    return this.reviewsService.findMany(filters);
  }

  @Get('reviewable')
  @UseGuards(JwtAuthGuard)
  async getReviewableOrders(@Req() req): Promise<any> {
    const userId = req.user.id;
    return this.reviewsService.getReviewableOrders(userId);
  }

  @Get('seller/:sellerId')
  async getSellerReviews(
    @Param('sellerId') sellerId: string,
    @Query() filters: ReviewFiltersDto,
  ) {
    return this.reviewsService.getSellerReviews(sellerId, filters);
  }

  @Patch(':id/update')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const userId = req.user.id;
    return this.reviewsService.update(id, userId, updateReviewDto);
  }

  @Patch(':id/respond')
  @UseGuards(JwtAuthGuard)
  async respond(
    @Param('id') id: string,
    @Req() req,
    @Body() respondDto: RespondToReviewDto,
  ) {
    const userId = req.user.id;
    return this.reviewsService.respondToReview(id, userId, respondDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.reviewsService.delete(id, userId, userRole);
  }
}
