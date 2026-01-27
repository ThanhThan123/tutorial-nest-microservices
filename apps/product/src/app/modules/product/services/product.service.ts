import { Injectable } from '@nestjs/common';
import { ProductReponsitory } from '../repositories/product.reponsitory';

@Injectable()
export class ProductService {
  constructor(private readonly productReponsitory: ProductReponsitory) {}
}
