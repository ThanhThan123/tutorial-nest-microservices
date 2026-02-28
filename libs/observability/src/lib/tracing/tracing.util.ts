import { ClientProxy } from '@nestjs/microservices';
import { context, propagation } from '@opentelemetry/api';
import { Observable } from 'rxjs';

export interface Carrier {
  traceparent?: string;
  tracestate?: string;
}

export function createTracingClientProxy<T extends ClientProxy>(client: T): T {
  return new Proxy(client as any, {
    get: (target, prop) => {
      if (prop === 'send') {
        return (pattern: any, data: any) => wrapRequests(target, 'send', pattern, data);
      }

      if (prop === 'emit') {
        return (pattern: any, data: any) => wrapRequests(target, 'emit', pattern, data);
      }

      return target[prop];
    },
  });
}
function wrapRequests(client: ClientProxy, method: 'send' | 'emit', pattern: any, data: any): Observable<any> {
  const carrier: Carrier = {};

  propagation.inject(context.active(), carrier);

  const payloadWithTrace = {
    data: data,
    __tracing__: carrier,
  };

  return client[method](pattern, payloadWithTrace);
}
