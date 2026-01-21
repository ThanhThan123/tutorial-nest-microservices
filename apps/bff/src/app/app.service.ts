import { BadGatewayException, Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getData(): { message: string } {
    throw new BadGatewayException('Bad GetWay');
    return { message: 'Hello API' };
  }
}
