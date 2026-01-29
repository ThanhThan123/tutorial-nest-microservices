import { UserGetAllTcpResponse } from '@common/interfaces/gateway/user';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { User } from '@common/schemas/user.schema';
import { ObjectId } from 'mongodb';

export const createUserRequestMapping = (data: CreateUserTcpRequest, userId: string): Partial<User> => {
  return {
    ...data,

    //convert array to object
    roles: data.roles.map((role) => new ObjectId(role)),
    userId,
  };
};

export const getUserRequestMapping = (data: UserGetAllTcpResponse): Partial<User> => {
  return {
    ...data,
    roles: data.items[0].roles.map((role) => new ObjectId(role)),
  };
};
