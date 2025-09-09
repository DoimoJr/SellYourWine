import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSellerDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new BadRequestException('User not found');
    return this.prisma.seller.create({ data: { userId: dto.userId, displayName: dto.displayName } });
  }

  async getByUser(userId: string) {
    const s = await this.prisma.seller.findUnique({ where: { userId } });
    if (!s) throw new NotFoundException('Seller not found');
    return s;
  }

  async get(id: string) {
    const s = await this.prisma.seller.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Seller not found');
    return s;
  }
}