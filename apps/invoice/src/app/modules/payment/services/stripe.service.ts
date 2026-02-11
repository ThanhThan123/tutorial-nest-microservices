import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateCheckoutSessionRequest } from '@common/interfaces/common';
@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_CONFIG.SECRET_KEY'), {
      apiVersion: '2026-01-28.clover',
    });
  }

  async createCheckoutSession(params: CreateCheckoutSessionRequest) {
    const invoiceId = String(params?.invoiceId ?? '').trim();
    if (!invoiceId) {
      throw new Error(`Missing invoiceId. params=${JSON.stringify(params)}`);
    }
    console.log('createCheckoutSession params=', params);
    console.log('invoiceId=', params?.invoiceId);
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'amazon_pay', 'alipay'],
      mode: 'payment',
      success_url: this.configService.get('STRIPE_CONFIG.SUCCESS_KEY'),
      cancel_url: this.configService.get('STRIPE_CONFIG.CANCEL_URL'),
      line_items: params.lineItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      customer_email: params.clientEmail,
      metadata: {
        invoiceId,
      },
    });

    return {
      url: session.url,
      sessionId: session.id,
    };
  }
}
