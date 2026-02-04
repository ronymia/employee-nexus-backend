import { Module, forwardRef } from '@nestjs/common';
import { PayrollItemsService } from './payroll-items.service';
import { PayrollItemsResolver } from './payroll-items.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PayrollComponentsModule } from '../payroll-components/payroll-components.module';
import { PayrollCyclesModule } from '../payroll-cycles/payroll-cycles.module';

@Module({
  imports: [
    PrismaModule,
    PayrollComponentsModule,
    forwardRef(() => PayrollCyclesModule),
  ],
  providers: [PayrollItemsService, PayrollItemsResolver],
  exports: [PayrollItemsService],
})
export class PayrollItemsModule {}
