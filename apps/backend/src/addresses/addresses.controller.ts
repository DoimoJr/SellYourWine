import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly svc: AddressesService) {}

  @ApiOperation({ summary: 'Lista indirizzi di un utente' })
  @ApiQuery({ name: 'userId', required: true })
  @Get()
  listByUser(@Query('userId') userId: string) {
    return this.svc.listByUser(userId);
  }

  @ApiOperation({ summary: 'Dettaglio indirizzo' })
  @ApiParam({ name: 'id' }) @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @ApiOperation({ summary: 'Crea indirizzo' })
  @Post() create(@Body() dto: CreateAddressDto) { return this.svc.create(dto); }

  @ApiOperation({ summary: 'Aggiorna indirizzo' })
  @ApiParam({ name: 'id' }) @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAddressDto) { return this.svc.update(id, dto); }

  @ApiOperation({ summary: 'Elimina indirizzo' })
  @ApiParam({ name: 'id' }) @Delete(':id')
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}