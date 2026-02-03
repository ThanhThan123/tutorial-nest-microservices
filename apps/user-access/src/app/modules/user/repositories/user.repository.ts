import { User, UserModel, UserModelName } from '@common/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { DeleteResult, QueryFilter } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(UserModelName) private readonly userModel: UserModel) {}

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  async getAll(filter: QueryFilter<User>, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.userModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      this.userModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  getById(id: string) {
    return this.userModel.findById(id).exec();
  }

  getByUserId(userId: string) {
    return this.userModel.findOne({ userId }).populate('roles').exec();
  }
  getByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
  async exists(email: string) {
    const result = await this.userModel.exists({ email }).exec();
    return !!result;
  }

  deleteByUserId(userId: string): Promise<DeleteResult> {
    return this.userModel.deleteOne({ userId }).exec();
  }
}
