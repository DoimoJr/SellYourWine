import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, seller: true } },
        payment: true,
        shippingAddress: true,
        billingAddress: true,
        buyer: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findMany(buyerId?: string) {
    return this.prisma.order.findMany({
      where: buyerId ? { buyerId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async create(dto: CreateOrderDto) {
    // 1) Carica prodotti (prezzo, seller, stock)
    const productIds = dto.items.map(i => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { inventory: true, seller: true },
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException('Some products are invalid or inactive');
    }

    // 2) Mappa qty e controlla stock
    const qtyById = new Map(dto.items.map(i => [i.productId, i.qty]));
    for (const p of products) {
      const need = qtyById.get(p.id) || 0;
      if (!p.inventory?.managed) continue;
      if ((p.inventory?.quantity ?? 0) < need) {
        throw new BadRequestException(`Insufficient stock for product ${p.name}`);
      }
    }

    // 3) Calcola subtotale/valute (prezzi dal DB, non dal client)
    const currency = 'EUR';
    let subtotal = 0;
    const lineData = products.map(p => {
      const qty = qtyById.get(p.id)!;
      subtotal += qty * p.priceCents;
      return {
        productId: p.id,
        sellerId: p.sellerId,
        qty,
        unitPriceCents: p.priceCents,
      };
    });

    const shippingCents = 0; // MVP: calcolo flat o 0; in futuro logica corrieri
    const feeCents = 0;      // MVP: fee marketplace se vuoi
    const total = subtotal + shippingCents + feeCents;

    // 4) Transazione: crea ordine + righe + scala stock
    const order = await this.prisma.$transaction(async (tx) => {
      // crea ordine
      const created = await tx.order.create({
        data: {
          buyerId: dto.buyerId ?? null,
          currency,
          status: 'paid', // MVP: simuliamo ordine già pagato; con Stripe userai 'pending' finché non arriva il webhook
          paymentMethod: dto.paymentMethod ?? 'direct',
          subtotalCents: subtotal,
          shippingCents,
          feeCents,
          totalCents: total,
          shippingAddressId: dto.shippingAddressId,
          billingAddressId: dto.billingAddressId ?? dto.shippingAddressId,
          items: { create: lineData },
        },
      });

      // scala stock
      for (const p of products) {
        const qty = qtyById.get(p.id)!;
        if (p.inventory?.managed) {
          await tx.inventory.update({
            where: { productId: p.id },
            data: { quantity: { decrement: qty } },
          });
        }
      }

      return created;
    });

    return this.findOne(order.id);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const exists = await this.prisma.order.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Order not found');

    // Piccole regole di transizione (MVP)
    const allowed = new Set(['paid','label_generated','shipped','delivered','cancelled']);
    if (!allowed.has(dto.status)) throw new BadRequestException('Invalid status');

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status as any },
    });
  }
}