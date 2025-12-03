import { Module } from '@nestjs/common';
import { PayrollComponentsService } from './payroll-components.service';
import { PayrollComponentsResolver } from './payroll-components.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PayrollComponentsService, PayrollComponentsResolver],
  exports: [PayrollComponentsService],
})
export class PayrollComponentsModule {}
