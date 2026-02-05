import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  ArrayNotEmpty,
  ValidateNested,
  IsArray,
  IsInt,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
class ClientRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;
}

class ItemRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsNumber()
  varRate: number;

  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
export class CreateInvoiceRequestDto {
  @ApiProperty({ type: ClientRequestDto })
  @IsNotEmpty()
  @Type(() => ClientRequestDto)
  client: ClientRequestDto;

  @ApiProperty({ type: [ItemRequestDto] })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ItemRequestDto)
  items: ItemRequestDto[];
}

export class GetInvoiceByPageRequestDto {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Min(1)
  page: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  keyword?: string;
}
