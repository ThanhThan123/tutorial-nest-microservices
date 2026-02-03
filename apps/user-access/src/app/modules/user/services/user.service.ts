import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { createUserRequestMapping } from '../mappers';
import { UserGetAllTcpRequest, DeleteUserResponseDto } from '@common/interfaces/gateway/user';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { CreateKeycloakUserTcpReq } from '@common/interfaces/tcp/authorizer';
import { firstValueFrom, map } from 'rxjs';
import type { DeleteResult } from 'mongodb';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient,
  ) {}
  async create(params: CreateUserTcpRequest, processId: string) {
    const isExist = await this.userRepository.exists(params.email);

    if (isExist) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const userId = await this.createKeycloakUser(
      {
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        password: params.password,
      },
      processId,
    );
    const input = createUserRequestMapping(params, userId);

    return this.userRepository.create(input);
  }

  async createKeycloakUser(data: CreateKeycloakUserTcpReq, processId: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<string>(TCP_REQUEST_MESSSAGE.KEYCLOAK.CREATE_USER, {
          data,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
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

  async getUserByUserId(userId: string) {
    return await this.userRepository.getByUserId(userId);
  }

  async deleteUserByUserId(userId: string): Promise<DeleteUserResponseDto> {
    const result: DeleteResult = await this.userRepository.deleteByUserId(userId);
    const affected = result?.deletedCount ?? 0;

    return { userId, success: affected > 0, affected };
  }

  async updateUserByUserId(data: any, userId: string) {
    const result = await this.userRepository.updateByUserId(userId, data);
    return result;
  }
}
