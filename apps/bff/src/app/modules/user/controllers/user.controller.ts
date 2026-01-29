import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Get, Inject, Post, Query, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateUserRequestDto,
  GetAllUsersQueryDto,
  UserGetAllTcpRequest,
  UserGetAllTcpResponse,
} from '@common/interfaces/gateway/user';
import { ProcessId } from '@common/decorators/processId.decorator';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { TCP_REQUEST_MESSSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { map } from 'rxjs';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(@Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessClient: TcpClient) {}

  @Post()
  @ApiOkResponse({
    type: ResponseDto<string>,
  })
  @ApiOperation({
    summary: 'Create new user',
  })
  create(@Body() body: CreateUserRequestDto, @ProcessId() processId: string) {
    return this.userAccessClient
      .send<string, CreateUserTcpRequest>(TCP_REQUEST_MESSSAGE.USER.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get()
  @ApiOkResponse({
    type: ResponseDto<string>,
  })
  @ApiOperation({
    summary: 'Get all new user',
  })
  getAll(@Req() req: any, @Query() query: GetAllUsersQueryDto, @ProcessId() processId: string) {
    return this.userAccessClient
      .send<UserGetAllTcpResponse, UserGetAllTcpRequest>(TCP_REQUEST_MESSSAGE.USER.GET_ALL, {
        data: query,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
