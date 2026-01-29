import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { createUserRequestMapping, getUserRequestMapping } from '../mappers';
import { UserGetAllTcpRequest, UserGetAllTcpResponse } from '@common/interfaces/gateway/user';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(params: CreateUserTcpRequest) {
    const isExist = await this.userRepository.exists(params.email);

    if (isExist) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const input = createUserRequestMapping(params);

    return this.userRepository.create(input);
  }
  async getAll(params: UserGetAllTcpRequest) {
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(100, Math.max(1, Number(params.limit || 10)));

    const keyword = (params.keyword || '').trim();
    const filter: any = {};

    if (keyword) {
      filter.$or = [{ email: { $regex: keyword, $options: 'i' } }, { firstName: { $regex: keyword, $options: 'i' } }];
    }
    const { items, total } = await this.userRepository.getAll(filter, page, limit);

    return {
      items: items.map((u: any) => ({
        id: String(u._id ?? u.id),
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        roles: (u.roles ?? []).map((r: any) => String(r)),
      })),
      total,
      page,
      limit,
    };
  }
}
