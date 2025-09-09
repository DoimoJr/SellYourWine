import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
export class CreateSellerDto {
  @ApiProperty() @IsUUID() userId: string; // in futuro verrà dal token
  @ApiProperty() @IsString() displayName: string;
}