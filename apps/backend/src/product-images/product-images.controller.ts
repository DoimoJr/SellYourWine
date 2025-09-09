import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductImagesService } from './product-images.service';
import { AddImageDto } from './dto/upsert-image.dto';

@ApiTags('Product Images')
@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly svc: ProductImagesService) {}

  @ApiOperation({ summary: 'Lista immagini di un prodotto' })
  @ApiQuery({ name: 'productId', required: true })
  @Get()
  list(@Query('productId') productId: string) {
    return this.svc.list(productId);
  }

  @ApiOperation({ summary: 'Aggiungi immagine a un prodotto' })
  @Post()
  add(@Body() dto: AddImageDto) {
    return this.svc.add(dto);
  }

  @ApiOperation({ summary: 'Elimina immagine' })
  @ApiParam({ name: 'id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}