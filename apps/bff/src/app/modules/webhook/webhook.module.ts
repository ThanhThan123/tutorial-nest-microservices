import { Module } from '@nestjs/common';
import { WebhookController } from './controllers/webhook.controller';
import { StripeWebhookService } from './services/stripe-webhook.service';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';

@Module({
  controllers: [WebhookController],
  providers: [StripeWebhookService, TcpProvider(TCP_SERVICES.INVOICE_SERVICE)],
  exports: [],
})
export class WebhookModule {}
