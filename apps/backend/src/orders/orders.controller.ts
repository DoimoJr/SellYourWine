import { Controller, Get, Post, Param, Body, Query, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @ApiOperation({ summary: 'Crea un ordine (MVP: pagato subito)' })
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orders.create(dto);
  }

  @ApiOperation({ summary: 'Lista ordini (opz. filtro per buyerId)' })
  @ApiQuery({ name: 'buyerId', required: false })
  @Get()
  findMany(@Query('buyerId') buyerId?: string) {
    return this.orders.findMany(buyerId);
  }

  @ApiOperation({ summary: 'Dettaglio ordine' })
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orders.findOne(id);
  }

  @ApiOperation({ summary: 'Aggiorna stato ordine' })
  @ApiParam({ name: 'id', type: String })
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orders.updateStatus(id, dto);
  }
}