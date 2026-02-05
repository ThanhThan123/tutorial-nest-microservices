import { GetInvoiceByPageResponseDto } from '../../gateway/invoice';
import { Invoice } from '@common/schemas/invoice.schema';
export type InvoiceTcpResponse = Invoice;
export type GetInvoiceByPageTcpResponse = GetInvoiceByPageResponseDto;
