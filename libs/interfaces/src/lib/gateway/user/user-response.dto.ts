import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/base-response.dto';

export class UserResponseDto extends BaseResponseDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  roles: string[];
}

export class UserGetAllTcpResponse {
  items: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  keyword?: string;
}

export class DeleteUserResponseDto {
  userId: string;
  success: boolean;
  affected: number;
}

export class UpdateUserResponseDto {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}
