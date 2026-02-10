import { CreateInvoiceRequestDto, GetInvoiceByPageRequestDto, UpdateInvoiceRequestDto } from '../../gateway/invoice';

export type CreateInvoiceTcpRequest = CreateInvoiceRequestDto;
export type GetInvoiceByPageTcpRequest = GetInvoiceByPageRequestDto;
export type UpdateInvoiceTcpRequest = UpdateInvoiceRequestDto;

export type SendInvoiceTcpReq = {
  invoiceId: string;
  userId: string;
};
