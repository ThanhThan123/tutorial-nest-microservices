import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductReponsitory } from '../repositories/product.reponsitory';
import { CreateProductTcpRequest } from '@common/interfaces/tcp/product';

@Injectable()
export class ProductService {
  constructor(private readonly productReponsitory: ProductReponsitory) {}

  async create(data: CreateProductTcpRequest) {
    const { sku, name } = data;

    const exists = await this.productReponsitory.exists(sku, name);
    if (exists) {
      throw new BadRequestException('Product already exist');
    }
    return this.productReponsitory.create(data);
  }

  getList() {
    return this.productReponsitory.findAll();
  }
}
