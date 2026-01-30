export type ExchangeClientTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  scope: string;
};

export type CreateKeycloakUserRequest = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
};

export class ExchangeUserTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  id_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  refresh_token: string;
  scope: string;
}
