import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly svc: CategoriesService) {}

  @ApiOperation({ summary: 'Lista categorie' }) @Get() findAll() { return this.svc.findAll(); }
  @ApiOperation({ summary: 'Dettaglio categoria' }) @ApiParam({ name: 'id' }) @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @ApiOperation({ summary: 'Crea categoria' }) @Post() create(@Body() dto: CreateCategoryDto) { return this.svc.create(dto); }
  @ApiOperation({ summary: 'Aggiorna categoria' }) @ApiParam({ name: 'id' }) @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) { return this.svc.update(id, dto); }
  @ApiOperation({ summary: 'Elimina categoria' }) @ApiParam({ name: 'id' }) @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}