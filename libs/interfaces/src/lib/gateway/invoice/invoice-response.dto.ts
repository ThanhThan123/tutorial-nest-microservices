import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/base-response.dto';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { PaginationMetaDto } from '../common/base-entity-response.dto';
export class ClientReponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;
}
class ItemResponseDto {
  @ApiProperty({ type: String })
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  vatRate: number;

  @ApiProperty()
  total: number;
}

export class InvoiceResponseDto extends BaseResponseDto {
  @ApiProperty({ type: String })
  client: ClientReponseDto;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  vatAmount: number;

  @ApiProperty({ type: String, enum: INVOICE_STATUS })
  status: INVOICE_STATUS;

  @ApiProperty({ type: [ItemResponseDto] })
  items: ItemResponseDto[];

  @ApiPropertyOptional({ type: String })
  supervisorId?: string;

  @ApiPropertyOptional()
  fileUrl?: string;
}

export class GetInvoiceByPageResponseDto {
  @ApiProperty({ type: [InvoiceResponseDto] })
  items: InvoiceResponseDto[];
  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class UpdateInvoiceResponseDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String, enum: INVOICE_STATUS })
  status: INVOICE_STATUS;
}
