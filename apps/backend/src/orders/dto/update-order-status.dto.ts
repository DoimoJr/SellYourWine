import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum OrderStatusDto {
  paid = 'paid',
  label_generated = 'label_generated',
  shipped = 'shipped',
  delivered = 'delivered',
  cancelled = 'cancelled',
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatusDto })
  @IsEnum(OrderStatusDto)
  status: OrderStatusDto;
}