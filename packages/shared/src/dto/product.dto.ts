import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  Min, 
  Max, 
  IsBoolean, 
  IsUUID,
  Length,
  IsEnum
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(1, 200)
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  vintage?: number;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  grapes?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  region?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  alcoholPct?: number;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  description?: string;

  @IsNumber()
  @Min(0)
  priceCents: number;

  @IsOptional()
  @IsString()
  @IsUUID()
  categoryId?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  vintage?: number;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  grapes?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  region?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  alcoholPct?: number;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceCents?: number;

  @IsOptional()
  @IsString()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}