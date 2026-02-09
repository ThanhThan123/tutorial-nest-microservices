import { Module } from '@nestjs/common';
import { AuthorizerService } from './services/authorizer.service';
import { AuthorizerController } from './controllers/authorizer.controller';
import { KeycloakModule } from '../keycloak.module';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { ClientsModule } from '@nestjs/microservices';
import { AuthorizerGrpcController } from './controllers/authorizer-grpc.controller';

@Module({
  imports: [KeycloakModule, ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.USER_ACCESS_SERVICE)])],
  controllers: [AuthorizerController, AuthorizerGrpcController],
  providers: [AuthorizerService],
})
export class AuthorizerModule {}
