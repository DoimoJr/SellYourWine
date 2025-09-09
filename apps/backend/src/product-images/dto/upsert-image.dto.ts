import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class AddImageDto {
  @ApiProperty() @IsUUID() productId: string;
  @ApiProperty() @IsString() url: string;
  @ApiProperty({ required: false, example: 0 }) @IsInt() @Min(0) @IsOptional() position?: number;
}