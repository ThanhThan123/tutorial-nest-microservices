import { getAccessToken } from '../support/auth.helper';
import { CreateInvoiceRequestDto, InvoiceResponseDto } from '@common/interfaces/gateway/invoice';
import axios from 'axios';

describe('Invoice E2E (HTTP)', () => {
  let accessToken: string;

  beforeAll(async () => {
    jest.setTimeout(30000);
    const authData = await getAccessToken();
    accessToken = authData.accessToken;
  }, 30000);

  it('should create invoice and send it', async () => {
    const createPayload: CreateInvoiceRequestDto = {
      client: {
        name: 'Client A',
        email: 'baram34724@hutudns.com',
        address: '123 St',
      },
      items: [
        {
          productId: 'prod_1',
          name: 'Product 1',
          quantity: 2,
          unitPrice: 100,
          vatRate: 0.1,
          total: 220,
        },
      ],
    };

    const createRes = await axios.post<{ data: InvoiceResponseDto }>(`/invoice`, createPayload, {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 20000,
    });

    expect(createRes.status).toBe(201);
    const invoice = createRes.data.data;
    expect(invoice).toBeDefined();

    const sendRes = await axios.post(
      `/invoice/${invoice.id}/send`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    expect(sendRes.status).toBe(201);
  }, 30000);
});

//nx e2e einvoice-e2e
