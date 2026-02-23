import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { CreateInvoiceTcpRequest, GetInvoiceByPageTcpRequest, SendInvoiceTcpReq } from '@common/interfaces/tcp/invoice';
import { createCheckoutSessionMapping, invoiceRequestMapping } from '../mappers';
import { UpdateInvoiceRequestDto } from '@common/interfaces/gateway/invoice';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { KafkaService } from '@common/kafka/kafka.service';
import { InvoiceSentPayload } from '@common/interfaces/queue/invoice';
import { InvoiceSendSagaContext } from '@common/interfaces/saga/saga-step.interface';
import { InvoiceSendSagaSteps } from '../sagas/invoice-send-saga-steps.service';
import { SAGA_TYPE } from '@common/constants/enum/saga.enum';
import { SagaOrchestrationService } from '@common/saga-orchestration/saga-orchestration.service';
@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly kafkaClient: KafkaService,
    private readonly sagaSteps: InvoiceSendSagaSteps,
    private readonly sagaOrchestrator: SagaOrchestrationService,
  ) {}

  create(params: CreateInvoiceTcpRequest) {
    const input = invoiceRequestMapping(params);
    return this.invoiceRepository.create(input);
  }

  getAll(params: GetInvoiceByPageTcpRequest) {
    return this.invoiceRepository.findPaged(params);
  }
  getInvoiceById(id: string) {
    if (!id) throw new BadRequestException('id is required');

    const invoice = this.invoiceRepository.getById(id);
    if (!invoice) throw new BadRequestException('invoice not found');

    return invoice;
  }

  async updateInvoiceById(id: string, patch: UpdateInvoiceRequestDto) {
    return this.invoiceRepository.updateById(id, patch);
  }
  async deleteInvoiceById(id: string) {
    return this.invoiceRepository.deleteById(id);
  }
  async sendById(params: SendInvoiceTcpReq, processId: string) {
    const { invoiceId, userId } = params;

    const invoice = await this.invoiceRepository.getById(invoiceId);

    if (invoice.status !== INVOICE_STATUS.CREATED) {
      throw new BadRequestException(ERROR_CODE.INVOICE_CAN_NOT_BE__SENT);
    }

    const context: InvoiceSendSagaContext = {
      sagaId: '',
      invoiceId,
      userId,
      processId,
    };

    const steps = this.sagaSteps.getSteps(invoice);

    try {
      await this.sagaOrchestrator.execute(SAGA_TYPE.INVOICE_SEND, steps, context);
      this.kafkaClient.emit<InvoiceSentPayload>('invoice-sent', {
        id: invoiceId,
        paymentLink: context.paymentLink,
      });
    } catch (error) {
      this.logger.error(`Failed to send invoice ${invoiceId} : ${error.message}`);
      throw error;
    }
  }

  updateInvoicePaid(invoiceId: string) {
    return this.invoiceRepository.updateInvoiceById(invoiceId, { status: INVOICE_STATUS.PAID });
  }

  getById(id: string) {
    return this.invoiceRepository.getById(id);
  }
}
