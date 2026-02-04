import { Product } from '@common/entities/product.entity';
import { GetAllProductResponseDto, UpdateProductResponseDto } from '../../gateway/product/product-reponse.dto';
export type ProductTcpResponse = Product;
export type ProductListTcpResponse = GetAllProductResponseDto;
export type ProductUpdateTcpResponse = UpdateProductResponseDto;
