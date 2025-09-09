import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class OrderItemInput {
  @ApiProperty({ example: 'uuid-prodotto' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  qty: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid-buyer', required: false, description: 'Per ora lo passiamo nel body, poi verrà dal token' })
  @IsUUID()
  @IsOptional()
  buyerId?: string;

  @ApiProperty({ example: 'uuid-shipping-address' })
  @IsUUID()
  shippingAddressId: string;

  @ApiProperty({ example: 'uuid-billing-address', required: false })
  @IsUUID()
  @IsOptional()
  billingAddressId?: string;

  @ApiProperty({ type: [OrderItemInput] })
  @IsArray()
  @ArrayMinSize(1)
  items: OrderItemInput[];

  @ApiProperty({ example: 'direct', required: false, description: 'direct | escrow (in futuro)' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}