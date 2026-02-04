import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityResponseDto, PaginationMetaDto } from '../common/base-entity-response.dto';

export class ProductResponseDto extends BaseEntityResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  vatRate: number;
}

export class GetAllProductResponseDto {
  @ApiProperty({ type: ProductResponseDto, isArray: true })
  items: ProductResponseDto[];
  @ApiProperty()
  meta: PaginationMetaDto;
}

export class UpdateProductResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  vatRate: number;
}
