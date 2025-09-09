import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty() @IsUUID() @IsOptional() userId?: string; // in futuro da token
  @ApiProperty() @IsString() fullName: string;
  @ApiProperty() @IsString() line1: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() line2?: string;
  @ApiProperty() @IsString() city: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() region?: string;
  @ApiProperty() @IsString() postalCode: string;
  @ApiProperty() @IsString() country: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() phone?: string;
  @ApiProperty({ required: false }) @IsBoolean() @IsOptional() isDefaultShipping?: boolean;
  @ApiProperty({ required: false }) @IsBoolean() @IsOptional() isDefaultBilling?: boolean;
}