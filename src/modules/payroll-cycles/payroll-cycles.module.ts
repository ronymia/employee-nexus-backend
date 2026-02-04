import { Module, forwardRef } from '@nestjs/common';
import { PayrollCyclesService } from './payroll-cycles.service';
import { PayrollCyclesResolver } from './payroll-cycles.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PayrollItemsModule } from '../payroll-items/payroll-items.module';

@Module({
  imports: [PrismaModule, forwardRef(() => PayrollItemsModule)],
  providers: [PayrollCyclesService, PayrollCyclesResolver],
  exports: [PayrollCyclesService],
})
export class PayrollCyclesModule {}
