import { BadRequestException, Injectable } from '@nestjs/common';
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
  getInvoiceById(id: string) {
    if (!id) throw new BadRequestException('id is required');

    const invoice = this.invoiceRepository.getById(id);
    if (!invoice) throw new BadRequestException('invoice not found');

    return invoice;
  }
}
