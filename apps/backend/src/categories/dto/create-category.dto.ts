import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ example: 'rosso' }) @IsString() slug: string;
  @ApiProperty({ required: false }) @IsUUID() @IsOptional() parentId?: string;
}