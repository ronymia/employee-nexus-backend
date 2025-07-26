import { Module } from '@nestjs/common';
import { ServicePlansService } from './service-plans.service';
import { ServicePlansResolver } from './service-plans.resolver';

@Module({
  providers: [ServicePlansResolver, ServicePlansService],
})
export class ServicePlansModule {}
