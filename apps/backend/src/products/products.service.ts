import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: { images: true, inventory: true, category: true, seller: true },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, inventory: true, category: true, seller: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    // In futuro sellerId verrà dal token JWT del venditore
    const {
      name,
      priceCents,
      currency = 'EUR',
      vintage,
      grapes,
      region,
      alcoholPct,
      description,
      sellerId,
      categoryId,
    } = dto;

    return this.prisma.product.create({
      data: {
        name,
        priceCents,
        currency,
        vintage,
        grapes,
        region,
        alcoholPct: alcoholPct as any, // Prisma Decimal compat
        description,
        sellerId: sellerId ?? undefined,   // sarà required quando aggiungiamo auth
        categoryId: categoryId ?? undefined,
        inventory: { create: { quantity: 0 } }, // stock iniziale
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    // se dto contiene alcoholPct number, Prisma vuole Decimal: va bene passarlo così, Prisma lo converte
    try {
      return await this.prisma.product.update({
        where: { id },
        data: {
          ...dto,
          alcoholPct: dto.alcoholPct as any,
        },
      });
    } catch {
      throw new NotFoundException('Product not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.delete({ where: { id } });
      return { ok: true };
    } catch {
      throw new NotFoundException('Product not found');
    }
  }
}