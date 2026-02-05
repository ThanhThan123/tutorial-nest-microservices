import { Controller, UseInterceptors } from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { TCP_REQUEST_MESSSAGE } from '@common/constants/enum/tcp-request-message.enum';
import {
  CreateInvoiceTcpRequest,
  InvoiceTcpResponse,
  GetInvoiceByPageTcpRequest,
} from '@common/interfaces/tcp/invoice';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern(TCP_REQUEST_MESSSAGE.INVOICE.CREATE)
  async create(@RequestParams() params: CreateInvoiceTcpRequest): Promise<Response<InvoiceTcpResponse>> {
    const result = await this.invoiceService.create(params);

    return Response.success<InvoiceTcpResponse>(result);
  }
  @MessagePattern(TCP_REQUEST_MESSSAGE.INVOICE.GET_ALL_BY_PAGE)
  async getAllByPage(@RequestParams() payload: any) {
    const params: GetInvoiceByPageTcpRequest = payload?.data ?? payload ?? {};
    const result = await this.invoiceService.getAll(params);
    return Response.success(result);
  }
  @MessagePattern(TCP_REQUEST_MESSSAGE.INVOICE.GET_BY_ID)
  async getInvoiceById(@RequestParams() payload: any): Promise<Response<InvoiceTcpResponse>> {
    const id = (payload?.data ?? payload) as string;
    const dto = await this.invoiceService.getInvoiceById(id);
    return Response.success(dto);
  }
}
