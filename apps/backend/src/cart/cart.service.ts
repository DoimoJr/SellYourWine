import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  /**
   * Ottieni o crea il carrello dell'utente
   */
  async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: true,
                images: true,
                inventory: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  seller: true,
                  images: true,
                  inventory: true
                }
              }
            }
          }
        }
      });
    }

    // Calcola totali
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.product.priceCents * item.quantity);
    }, 0);

    return {
      ...cart,
      subtotalCents: subtotal,
      itemsCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  /**
   * Aggiungi prodotto al carrello
   */
  async addToCart(userId: string, dto: AddToCartDto) {
    // Verifica che il prodotto esista e sia attivo
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { inventory: true }
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or inactive');
    }

    // Verifica disponibilità inventario
    if (product.inventory?.managed && product.inventory.quantity < dto.quantity) {
      throw new BadRequestException(`Only ${product.inventory.quantity} items available`);
    }

    // Ottieni o crea carrello
    let cart = await this.prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId }
      });
    }

    // Verifica se il prodotto è già nel carrello
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId
        }
      }
    });

    if (existingItem) {
      // Aggiorna quantità
      const newQuantity = existingItem.quantity + dto.quantity;
      
      // Verifica disponibilità per la nuova quantità
      if (product.inventory?.managed && product.inventory.quantity < newQuantity) {
        throw new BadRequestException(`Only ${product.inventory.quantity} items available`);
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      // Crea nuovo item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity
        }
      });
    }

    return this.getOrCreateCart(userId);
  }

  /**
   * Aggiorna quantità item nel carrello
   */
  async updateCartItem(userId: string, productId: string, dto: UpdateCartItemDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      },
      include: {
        product: {
          include: { inventory: true }
        }
      }
    });

    if (!cartItem) {
      throw new NotFoundException('Item not in cart');
    }

    // Verifica disponibilità
    if (cartItem.product.inventory?.managed && cartItem.product.inventory.quantity < dto.quantity) {
      throw new BadRequestException(`Only ${cartItem.product.inventory.quantity} items available`);
    }

    await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: dto.quantity }
    });

    return this.getOrCreateCart(userId);
  }

  /**
   * Rimuovi item dal carrello
   */
  async removeFromCart(userId: string, productId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    if (!cartItem) {
      throw new NotFoundException('Item not in cart');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id }
    });

    return this.getOrCreateCart(userId);
  }

  /**
   * Svuota carrello
   */
  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId }
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    return this.getOrCreateCart(userId);
  }
}
