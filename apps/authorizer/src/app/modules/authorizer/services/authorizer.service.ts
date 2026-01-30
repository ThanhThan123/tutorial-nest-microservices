import { LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
import { Injectable } from '@nestjs/common';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';

@Injectable()
export class AuthorizerService {
  constructor(private readonly keycloakHttpService: KeycloakHttpService) {}

  async login(params: LoginTcpRequest) {
    const { username, password } = params;

    const { access_token: accessToken, refresh_token: refeshToken } = await this.keycloakHttpService.exchangeUserToken({
      username,
      password,
    });

    return {
      accessToken,
      refeshToken,
    };
  }
}
