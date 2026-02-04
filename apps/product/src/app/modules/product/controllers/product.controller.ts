import { Controller, Res, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { ProductService } from '../services/product.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { CreateProductTcpRequest, ProductTcpResponse, ProductListTcpResponse } from '@common/interfaces/tcp/product';
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
  async getList(@RequestParams() payload: any): Promise<Response<ProductListTcpResponse>> {
    const query = payload?.data ?? payload ?? {};
    const result = await this.productService.getList(query);
    return Response.success<ProductListTcpResponse>(result);
  }
}
