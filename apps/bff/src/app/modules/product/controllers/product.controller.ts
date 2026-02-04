import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Controller, Inject, Body, Post, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateProductRequestDto,
  ProductResponseDto,
  GetAllProductResponseDto,
} from '@common/interfaces/gateway/product';
import { TCP_REQUEST_MESSSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
import {
  CreateProductTcpRequest,
  ProductTcpResponse,
  ProductListTcpResponse,
  GetAllProductTcpRequest,
} from '@common/interfaces/tcp/product';
import { map } from 'rxjs';
@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(@Inject(TCP_SERVICES.PRODUCT_SERVICE) private readonly productClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() body: CreateProductRequestDto, @ProcessId() processId: string) {
    return this.productClient
      .send<ProductTcpResponse, CreateProductTcpRequest>(TCP_REQUEST_MESSSAGE.PRODUCT.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get()
  @ApiOkResponse({ type: ResponseDto<GetAllProductResponseDto> })
  @ApiOperation({ summary: 'Get list Products' })
  getList(@Query() query: GetAllProductTcpRequest, @ProcessId() processId: string) {
    return this.productClient
      .send<
        ProductListTcpResponse,
        GetAllProductTcpRequest
      >(TCP_REQUEST_MESSSAGE.PRODUCT.GET_LIST, { data: query, processId })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
