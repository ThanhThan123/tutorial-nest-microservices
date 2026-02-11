import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceModel, InvoiceModelName } from '@common/schemas/invoice.schema';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { UpdateInvoiceRequestDto } from '@common/interfaces/gateway/invoice';
import { DeleteResult } from 'mongodb';
@Injectable()
export class InvoiceReponsitory {
  constructor(@InjectModel(InvoiceModelName) private readonly invoiceModel: InvoiceModel) {}

  create(data: Partial<Invoice>) {
    return this.invoiceModel.create({
      ...data,
      status: INVOICE_STATUS.CREATED,
    });
  }

  async findPaged(params: { page: number; limit: number; keyword?: string }) {
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(100, Math.max(1, Number(params.limit || 10)));
    const skip = (page - 1) * limit;

    const keyword = params.keyword?.trim();
    const filter: any = {};
    if (keyword) {
      const re = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: { $regex: re } }];
    }
    const [items, total] = await Promise.all([
      this.invoiceModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      this.invoiceModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  getById(id: string) {
    return this.invoiceModel.findById(id).exec();
  }

  updateById(id: string, patch: UpdateInvoiceRequestDto) {
    return this.invoiceModel.findByIdAndUpdate(id, patch, { new: true, runValidators: true }).exec();
  }
  updateInvoiceById(id: string, data: Partial<Invoice>) {
    return this.invoiceModel.findByIdAndUpdate(id, data, { new: true });
  }

  deleteById(id: string): Promise<DeleteResult> {
    return this.invoiceModel.deleteOne({ _id: id }).exec();
  }
}

// stripe listen --forward-to localhost:3300/api/v1/webhook/stripe
