import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SagaInstanceDestination } from '@common/schemas/saga.schema';
import { SagaOrchestrationRepository } from 'libs/saga-orchestration/src/lib/saga-orchestration.repository';
import { SagaOrchestrationService } from 'libs/saga-orchestration/src/lib/saga-orchestration.service';
@Module({})
export class SagaOrchestrationModule {
  static forRoot() {
    return {
      module: SagaOrchestrationModule,
      global: true,
      imports: [MongooseModule.forFeature([SagaInstanceDestination])],
      provider: [SagaOrchestrationRepository, SagaOrchestrationService],
      exports: [SagaOrchestrationService],
    };
  }
}
