import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IncDecInventoryDto, SetInventoryDto } from './dto/adjust-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getByProduct(productId: string) {
    const inv = await this.prisma.inventory.findUnique({ where: { productId } });
    if (!inv) throw new NotFoundException('Inventory not found');
    return inv;
  }

  async set(dto: SetInventoryDto) {
    const exists = await this.prisma.inventory.findUnique({ where: { productId: dto.productId } });
    if (exists) {
      return this.prisma.inventory.update({
        where: { productId: dto.productId },
        data: { quantity: dto.quantity, sku: dto.sku ?? exists.sku ?? null },
      });
    } else {
      return this.prisma.inventory.create({
        data: { productId: dto.productId, quantity: dto.quantity, sku: dto.sku },
      });
    }
  }

  async adjust(dto: IncDecInventoryDto) {
    const exists = await this.prisma.inventory.findUnique({ where: { productId: dto.productId } });
    if (!exists) throw new NotFoundException('Inventory not found');
    return this.prisma.inventory.update({
      where: { productId: dto.productId },
      data: { quantity: { increment: dto.quantity } },
    });
  }
}