import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { IncDecInventoryDto, SetInventoryDto } from './dto/adjust-inventory.dto';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly svc: InventoryService) {}

  @ApiOperation({ summary: 'Leggi stock per productId' })
  @ApiQuery({ name: 'productId', required: true })
  @Get()
  get(@Query('productId') productId: string) {
    return this.svc.getByProduct(productId);
  }

  @ApiOperation({ summary: 'Imposta stock (override)' })
  @Post('set')
  set(@Body() dto: SetInventoryDto) {
    return this.svc.set(dto);
  }

  @ApiOperation({ summary: 'Aggiusta stock (+/-)' })
  @Post('adjust')
  adjust(@Body() dto: IncDecInventoryDto) {
    return this.svc.adjust(dto);
  }
}