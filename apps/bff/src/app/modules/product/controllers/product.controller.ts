import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Controller, Inject, Body, Post, Get, Query, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateProductRequestDto,
  ProductResponseDto,
  GetAllProductResponseDto,
  UpdateProductBySkuRequest,
  UpdateProductRequestDto,
} from '@common/interfaces/gateway/product';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
import {
  CreateProductTcpRequest,
  ProductTcpResponse,
  ProductListTcpResponse,
  GetAllProductTcpRequest,
  ProductUpdateTcpResponse,
} from '@common/interfaces/tcp/product';
import { map } from 'rxjs';
import { Authorization } from '@common/decorators/authorizer.decorator';
import { Permissions } from '@common/decorators/permission.decorator';
import { PERMISSION } from '@common/constants/enum/role.enum';
@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(@Inject(TCP_SERVICES.PRODUCT_SERVICE) private readonly productClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'Create a new product' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.PRODUCT_CREATE])
  create(@Body() body: CreateProductRequestDto, @ProcessId() processId: string) {
    return this.productClient
      .send<ProductTcpResponse, CreateProductTcpRequest>(TCP_REQUEST_MESSAGE.PRODUCT.CREATE, {
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
      >(TCP_REQUEST_MESSAGE.PRODUCT.GET_LIST, { data: query, processId })
      .pipe(map((data) => new ResponseDto(data)));
  }
  @Get(':sku')
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'Get One Product' })
  getOne(@Param('sku') sku: string, @ProcessId() processId: string) {
    return this.productClient
      .send<ProductTcpResponse, string>(TCP_REQUEST_MESSAGE.PRODUCT.GET_ONE_BY_SKU, {
        data: sku,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
  @Patch(':sku')
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'Update Product' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.PRODUCT_UPDATE])
  update(@Param('sku') sku: string, @Body() body: UpdateProductRequestDto, @ProcessId() processId: string) {
    return this.productClient
      .send<ProductUpdateTcpResponse, UpdateProductBySkuRequest>(TCP_REQUEST_MESSAGE.PRODUCT.UPDATE_PRODUCT_BY_SKU, {
        data: { sku, patch: body },
        processId,
      })
      .pipe(map((res) => new ResponseDto(res)));
  }
  @Delete(':id')
  @ApiOkResponse({ type: ResponseDto<string> })
  @ApiOperation({ summary: 'Delete Product' })
  //@Authorization({ secured: true })
  //@Permissions([PERMISSION.PRODUCT_DELETE])
  delete(@Param('id', ParseIntPipe) id: number, @ProcessId() processId: string) {
    return this.productClient
      .send<string, number>(TCP_REQUEST_MESSAGE.PRODUCT.DELETE_PRODUCT_BY_ID, { data: id, processId })
      .pipe(map((res) => new ResponseDto(res)));
  }
}
