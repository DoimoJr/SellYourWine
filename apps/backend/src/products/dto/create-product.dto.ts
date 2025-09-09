import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Chianti Classico DOCG' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1599, description: 'Prezzo in centesimi (EUR)' })
  @IsInt()
  @Min(0)
  priceCents: number;

  @ApiProperty({ example: 'EUR', default: 'EUR', required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: 2020, required: false })
  @IsInt()
  @IsOptional()
  vintage?: number;

  @ApiProperty({ example: 'Sangiovese, Canaiolo', required: false })
  @IsString()
  @IsOptional()
  grapes?: string;

  @ApiProperty({ example: 'Toscana', required: false })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({ example: 13.5, required: false })
  @IsOptional()
  alcoholPct?: number;

  @ApiProperty({ example: 'Vino rosso secco...', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'seller-id-uuid', required: false, description: 'Per ora opzionale: lo metteremo dal token seller in futuro' })
  @IsString()
  @IsOptional()
  sellerId?: string;

  @ApiProperty({ example: 'category-id-uuid', required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;
}