import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductReponsitory } from '../repositories/product.repository';
import {
  CreateProductTcpRequest,
  GetAllProductTcpRequest,
  UpdateProductTcpRequest,
  ProductListTcpResponse,
} from '@common/interfaces/tcp/product';

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

  async getList(query: GetAllProductTcpRequest): Promise<ProductListTcpResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const keyword = query.keyword?.trim();

    const { items, total } = await this.productReponsitory.findPaged({
      page,
      limit,
      keyword,
    });
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    return {
      items: items.map((p) => ({
        id: p.id,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        name: p.name,
        description: p.description,
        sku: p.sku,
        unit: p.unit,
        price: p.price,
        vatRate: (p as any).varRate ?? (p as any).varRate ?? 0,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  getOne(sku: string) {
    return this.productReponsitory.findBySku(sku);
  }

  async updateProduct(sku: string, patch: UpdateProductTcpRequest) {
    const result = await this.productReponsitory.updateProduct(sku, patch);

    return this.productReponsitory.findBySku(sku);
  }
  async deleteProduct(id: number) {
    return await this.productReponsitory.deleteProduct(id);
  }
}
