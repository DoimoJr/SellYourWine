import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Ottieni carrello dell\'utente corrente' })
  @ApiResponse({ status: 200, description: 'Carrello con items e totali' })
  @Get()
  getCart(@Request() req: any) {
    return this.cartService.getOrCreateCart(req.user.userId);
  }

  @ApiOperation({ summary: 'Aggiungi prodotto al carrello' })
  @ApiResponse({ status: 200, description: 'Prodotto aggiunto al carrello' })
  @ApiResponse({ status: 404, description: 'Prodotto non trovato' })
  @ApiResponse({ status: 400, description: 'Quantità non disponibile' })
  @Post('items')
  addToCart(@Request() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.userId, dto);
  }

  @ApiOperation({ summary: 'Aggiorna quantità prodotto nel carrello' })
  @ApiParam({ name: 'productId', type: String })
  @ApiResponse({ status: 200, description: 'Quantità aggiornata' })
  @ApiResponse({ status: 404, description: 'Prodotto non nel carrello' })
  @Patch('items/:productId')
  updateCartItem(
    @Request() req: any,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto
  ) {
    return this.cartService.updateCartItem(req.user.userId, productId, dto);
  }

  @ApiOperation({ summary: 'Rimuovi prodotto dal carrello' })
  @ApiParam({ name: 'productId', type: String })
  @ApiResponse({ status: 200, description: 'Prodotto rimosso dal carrello' })
  @Delete('items/:productId')
  removeFromCart(@Request() req: any, @Param('productId') productId: string) {
    return this.cartService.removeFromCart(req.user.userId, productId);
  }

  @ApiOperation({ summary: 'Svuota carrello' })
  @ApiResponse({ status: 200, description: 'Carrello svuotato' })
  @Delete()
  clearCart(@Request() req: any) {
    return this.cartService.clearCart(req.user.userId);
  }
}
