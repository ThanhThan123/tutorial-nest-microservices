import { Injectable } from '@nestjs/common';
import { PORT } from '@common/constants/common.constant';
@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
