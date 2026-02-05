import { Injectable } from '@nestjs/common';
import { InvoiceReponsitory } from '../repositories/invoice.repository';
import { CreateInvoiceTcpRequest, GetInvoiceByPageTcpRequest } from '@common/interfaces/tcp/invoice';
import { invoiceRequestMapping } from '../mappers';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceReponsitory) {}

  create(params: CreateInvoiceTcpRequest) {
    const input = invoiceRequestMapping(params);
    return this.invoiceRepository.create(input);
  }

  getAll(params: GetInvoiceByPageTcpRequest) {
    return this.invoiceRepository.findPaged(params);
  }
}
