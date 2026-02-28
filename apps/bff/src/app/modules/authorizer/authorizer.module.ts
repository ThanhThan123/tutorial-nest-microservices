import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { AuthorizerController } from './controller/authorizer.controller';
@Module({
  controllers: [AuthorizerController],
  providers: [TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE)],
  exports: [],
})
export class AuthorizerModule {}
