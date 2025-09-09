import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class SetInventoryDto {
  @ApiProperty() @IsUUID() productId: string;
  @ApiProperty() @IsInt() @Min(0) quantity: number;
  @ApiProperty({ required: false }) @IsString() @IsOptional() sku?: string;
}

export class IncDecInventoryDto {
  @ApiProperty() @IsUUID() productId: string;
  @ApiProperty({ example: 5 }) @IsInt() quantity: number; // può essere negativo per decrementare
}