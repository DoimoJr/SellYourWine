import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';

@ApiTags('Sellers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sellers')
export class SellersController {
  constructor(private readonly svc: SellersService) {}

  @ApiOperation({ summary: 'Crea profilo venditore' })
  @Post()
  create(@Body() dto: CreateSellerDto) { return this.svc.create(dto); }

  @ApiOperation({ summary: 'Dettaglio venditore' })
  @ApiParam({ name: 'id' }) @Get(':id')
  get(@Param('id') id: string) { return this.svc.get(id); }

  @ApiOperation({ summary: 'Dettaglio venditore per userId' })
  @ApiQuery({ name: 'userId', required: true }) @Get()
  getByUser(@Query('userId') userId: string) { return this.svc.getByUser(userId); }
}