import { Body, Controller, Get, Inject, Logger, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInvoiceRequestDto, InvoiceResponseDto } from '@common/interfaces/gateway/invoice';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSSAGE } from '@common/constants/enum/tcp-request-message.enum';
import {
  CreateInvoiceTcpRequest,
  InvoiceTcpResponse,
  GetInvoiceByPageTcpRequest,
  GetInvoiceByPageTcpResponse,
} from '@common/interfaces/tcp/invoice';
import { ProcessId } from '@common/decorators/processId.decorator';
import { map } from 'rxjs';
import { Authorization } from '@common/decorators/authorizer.decorator';
import { UserData } from '@common/decorators/userData.decorator';
import { AuthorizedMetadata } from '@common/interfaces/tcp/authorizer';
import { Permissions } from '@common/decorators/permission.decorator';
import { PERMISSION } from '@common/constants/enum/role.enum';
@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(@Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient) {}
  @Post()
  @ApiOkResponse({ type: ResponseDto<InvoiceResponseDto> })
  @ApiOperation({ summary: 'Create a new response' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_CREATE, PERMISSION.INVOICE_GET_BY_ID])
  create(
    @Body() body: CreateInvoiceRequestDto,
    @ProcessId() processId: string,
    @UserData() userData: AuthorizedMetadata,
  ) {
    Logger.debug('User data', userData);
    return this.invoiceClient
      .send<InvoiceTcpResponse, CreateInvoiceTcpRequest>(TCP_REQUEST_MESSSAGE.INVOICE.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
  @Get('')
  @ApiOkResponse({ type: ResponseDto<InvoiceResponseDto> })
  @ApiOperation({ summary: 'Get all invoice' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_GET_ALL])
  getAll(@Query() query: GetInvoiceByPageTcpRequest, @ProcessId() processId: string) {
    return this.invoiceClient
      .send<
        GetInvoiceByPageTcpResponse,
        GetInvoiceByPageTcpRequest
      >(TCP_REQUEST_MESSSAGE.INVOICE.GET_ALL_BY_PAGE, { data: query, processId })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
