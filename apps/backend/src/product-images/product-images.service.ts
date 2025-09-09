import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddImageDto } from './dto/upsert-image.dto';

@Injectable()
export class ProductImagesService {
  constructor(private prisma: PrismaService) {}

  list(productId: string) {
    return this.prisma.productImage.findMany({ where: { productId }, orderBy: { position: 'asc' } });
  }

  async add(dto: AddImageDto) {
    // verifica prodotto
    const prod = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!prod) throw new NotFoundException('Product not found');
    return this.prisma.productImage.create({ data: { ...dto, position: dto.position ?? 0 } });
  }

  async remove(id: string) {
    try {
      await this.prisma.productImage.delete({ where: { id } });
      return { ok: true };
    } catch {
      throw new NotFoundException('Image not found');
    }
  }
}