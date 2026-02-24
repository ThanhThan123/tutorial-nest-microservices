import { Product } from '@common/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(Product) private readonly repo: Repository<Product>) {}

  async create(data: Partial<Product>): Promise<Product> {
    const entity = await this.repo.create(data);
    return this.repo.save(entity);
  }

  async findAll() {
    await this.repo.find();
  }

  async findPaged(params: { page: number; limit: number; keyword?: string }) {
    const { page, limit, keyword } = params;
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('p');
    if (keyword?.trim()) {
      const kw = `%${keyword}%`;
      qb.andWhere('(p.name ILIKE :kw OR p.sku ILIKE :kw)', { kw });
    }

    qb.orderBy('p.createdAt', 'DESC').skip(skip).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async findById(id: number): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }
  async findBySku(sku: string): Promise<Product | null> {
    return this.repo.findOne({ where: { sku } });
  }
  async updateProduct(sku: string, data: Partial<Product>) {
    await this.repo.update({ sku }, data);
  }
  async deleteProduct(id: number): Promise<DeleteResult> {
    return this.repo.delete({ id });
  }
  async exists(sku: string, name: string): Promise<boolean> {
    const result = await this.repo.findOne({
      where: {
        sku,
        name,
      },
    });
    return !!result;
  }
}
