import {
  CreateProductRequestDto,
  GetAllProductQueryDto,
  UpdateProductRequestDto,
  UpdateProductBySkuRequest,
} from '../../gateway/product';

export type CreateProductTcpRequest = CreateProductRequestDto;
export type GetAllProductTcpRequest = GetAllProductQueryDto;
export type UpdateProductTcpRequest = UpdateProductRequestDto;
export type UpdateProductBySkuTcpRequest = UpdateProductBySkuRequest;
