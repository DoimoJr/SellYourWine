import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('health')
  health() {
    return { ok: true };
  }

  @Get('products')
  async getProducts() {
    return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  }
}