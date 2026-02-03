import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Delete, Get, Inject, Param, Post, Query, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateUserRequestDto,
  GetAllUsersQueryDto,
  UserGetAllTcpRequest,
  UserGetAllTcpResponse,
  DeleteUserRequestDto,
} from '@common/interfaces/gateway/user';
import { ProcessId } from '@common/decorators/processId.decorator';
import { CreateUserTcpRequest, DeleteUserTcpRequest } from '@common/interfaces/tcp/user';
import { TCP_REQUEST_MESSSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { Authorization } from '@common/decorators/authorizer.decorator';
import { map } from 'rxjs';
import { Permissions } from '@common/decorators/permission.decorator';
import { PERMISSION } from '@common/constants/enum/role.enum';
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
  @Authorization({ secured: false })
  getAll(@Req() req: any, @Query() query: GetAllUsersQueryDto, @ProcessId() processId: string) {
    return this.userAccessClient
      .send<UserGetAllTcpResponse, UserGetAllTcpRequest>(TCP_REQUEST_MESSSAGE.USER.GET_ALL, {
        data: query,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Delete('/users/:userId')
  @ApiOkResponse({
    type: ResponseDto<string>,
  })
  @ApiOperation({
    summary: 'Delete user',
  })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.USER_DELETE])
  delete(@Param('userId') userId: string, @ProcessId() processId: string) {
    return this.userAccessClient
      .send<DeleteUserTcpRequest, string>(TCP_REQUEST_MESSSAGE.USER.DELETE_BY_USER_ID, {
        data: userId,
        processId,
      })
      .pipe(map((res) => new ResponseDto(res)));
  }
}
