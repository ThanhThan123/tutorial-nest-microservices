import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { ProductService } from '../services/product.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import {
  CreateProductTcpRequest,
  ProductTcpResponse,
  ProductListTcpResponse,
  GetAllProductTcpRequest,
  ProductUpdateTcpResponse,
  UpdateProductBySkuTcpRequest,
} from '@common/interfaces/tcp/product';
import { RequestParams } from '@common/decorators/request-param.decorator';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(TCP_REQUEST_MESSSAGE.PRODUCT.CREATE)
  async create(@RequestParams() body: CreateProductTcpRequest): Promise<Response<ProductTcpResponse>> {
    const result = await this.productService.create(body);
    return Response.success<ProductTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSSAGE.PRODUCT.GET_LIST)
  async getList(@RequestParams() payload: GetAllProductTcpRequest): Promise<Response<ProductListTcpResponse>> {
    const result = await this.productService.getList(payload);
    return Response.success<ProductListTcpResponse>(result);
  }
  @MessagePattern(TCP_REQUEST_MESSSAGE.PRODUCT.GET_ONE_BY_SKU)
  async getOne(@RequestParams() sku: string) {
    const result = await this.productService.getOne(sku);
    return Response.success<ProductTcpResponse>(result);
  }
  @MessagePattern(TCP_REQUEST_MESSSAGE.PRODUCT.UPDATE_PRODUCT_BY_SKU)
  async update(
    @RequestParams()
    payload: UpdateProductBySkuTcpRequest,
  ): Promise<Response<ProductUpdateTcpResponse>> {
    const sku = payload.sku;
    const patch = payload.patch;
    const result = await this.productService.updateProduct(sku, patch);
    return Response.success<ProductUpdateTcpResponse>(result);
  }
}
