import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import {
  CreateInvoiceTcpRequest,
  InvoiceTcpResponse,
  GetInvoiceByPageTcpRequest,
  SendInvoiceTcpReq,
} from '@common/interfaces/tcp/invoice';
import { ProcessId } from '@common/decorators/processId.decorator';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}
  private readonly logger = new Logger(InvoiceService.name);
  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.CREATE)
  async create(@RequestParams() params: CreateInvoiceTcpRequest): Promise<Response<InvoiceTcpResponse>> {
    const result = await this.invoiceService.create(params);

    return Response.success<InvoiceTcpResponse>(result);
  }
  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.GET_ALL_BY_PAGE)
  async getAllByPage(@RequestParams() payload: any) {
    const params: GetInvoiceByPageTcpRequest = payload?.data ?? payload ?? {};
    const result = await this.invoiceService.getAll(params);
    return Response.success(result);
  }
  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.GET_BY_ID)
  async getInvoiceById(@RequestParams() payload: any): Promise<Response<InvoiceTcpResponse>> {
    const id = (payload?.data ?? payload) as string;
    const dto = await this.invoiceService.getInvoiceById(id);
    return Response.success(dto);
  }
  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.UPDATE_BY_ID)
  async updateInvoiceById(@RequestParams() payload: any): Promise<Response<InvoiceTcpResponse>> {
    const req = payload?.data ?? payload ?? {};
    const id = req.id;
    const patch = req.patch?.patch ?? req.patch;

    const dto = await this.invoiceService.updateInvoiceById(id, patch);
    this.logger.debug({ id, patch, processId: payload?.processId });

    return Response.success<InvoiceTcpResponse>(dto);
  }
  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.DELETE_BY_ID)
  async deleteInvoiceById(@RequestParams() payload: any) {
    const id = (payload?.data ?? payload) as string;
    const dto = await this.invoiceService.deleteInvoiceById(id);
    return Response.success(dto);
  }
  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.SEND)
  async sendInvoice(
    @RequestParams() params: SendInvoiceTcpReq,
    @ProcessId() processId: string,
  ): Promise<Response<string>> {
    const result = await this.invoiceService.sendById(params, processId);
    return Response.success<string>(result);
  }
}
