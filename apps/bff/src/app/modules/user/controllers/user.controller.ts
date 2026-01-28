import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserRequestDto } from '@common/interfaces/gateway/user';
import { ProcessId } from '@common/decorators/processId.decorator';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { TCP_RESQUEST_MESSSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { map } from 'rxjs';
@ApiTags('Users')
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
      .send<string, CreateUserTcpRequest>(TCP_RESQUEST_MESSSAGE.USER.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
