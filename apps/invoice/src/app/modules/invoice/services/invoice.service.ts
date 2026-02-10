import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InvoiceReponsitory } from '../repositories/invoice.repository';
import { CreateInvoiceTcpRequest, GetInvoiceByPageTcpRequest, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';
import { invoiceRequestMapping } from '../mappers';
import { UpdateInvoiceRequestDto } from '@common/interfaces/gateway/invoice';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { firstValueFrom, map } from 'rxjs';
import { Invoice } from '@common/schemas/invoice.schema';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ObjectId } from 'mongodb';
import { UploadFileTcpReq } from '@common/interfaces/tcp/media';
@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceReponsitory,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: TcpClient,
    @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaClient: TcpClient,
  ) {}

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

  async updateInvoiceById(id: string, patch: UpdateInvoiceRequestDto) {
    return this.invoiceRepository.updateById(id, patch);
  }
  async deleteInvoiceById(id: string) {
    return this.invoiceRepository.deleteById(id);
  }
  async sendById(params: SendInvoiceTcpReq, processId: string) {
    const { invoiceId, userId } = params;

    const invoice = await this.invoiceRepository.getById(invoiceId);

    if (invoice.status !== INVOICE_STATUS.CREATED) {
      throw new BadRequestException(ERROR_CODE.INVOICE_CAN_NOT_BE__SENT);
    }

    const pdfBase64 = await this.generatorInvoicePdf(invoice, processId);

    const fileUrl = await this.uploadFile({ fileBase64: pdfBase64, fileName: `invoice-${invoiceId}` }, processId);

    // TODO: Uploading file to cloudinary
    await this.invoiceRepository.updateInvoiceById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: new ObjectId(userId),
      fileUrl,
    });

    return fileUrl;
  }

  generatorInvoicePdf(data: Invoice, processId: string) {
    return firstValueFrom(
      this.pdfGeneratorClient
        .send<string, Invoice>(TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF, {
          data,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }
  uploadFile(data: UploadFileTcpReq, processId: string) {
    return firstValueFrom(
      this.mediaClient
        .send<string, UploadFileTcpReq>(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE, {
          data,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }
}
