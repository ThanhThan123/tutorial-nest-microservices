import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { createUserRequestMapping } from '../mappers';
import { UserGetAllTcpRequest, DeleteUserResponseDto, UpdateUserRequestDto } from '@common/interfaces/gateway/user';
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

  async updateUserByUserId(userId: string, patch: UpdateUserRequestDto) {
    if (!userId) throw new BadRequestException('userId is required');
    if (!patch || Object.keys(patch).length === 0) {
      throw new BadRequestException('patch is empty');
    }
    //find
    const existing = await this.userRepository.getById(userId);
    if (!existing) throw new NotFoundException('USER_NOT_FOUND');
    //update
    const result = await this.userRepository.updateByUserId(userId, patch);

    const matched = (result as any).matchedCount ?? 0;
    const modified = (result as any).modifiedCount ?? 0;
    return { userId, success: matched > 0 && modified > 0, matched, modified };
  }

  async findOneByUserId(userId: string) {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new UnauthorizedException(ERROR_CODE.USER_NOT_FOUND);
    }
    return user;
  }
}
