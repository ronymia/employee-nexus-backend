import { Module } from '@nestjs/common';
import { PayrollCyclesService } from './payroll-cycles.service';
import { PayrollCyclesResolver } from './payroll-cycles.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PayrollCyclesService, PayrollCyclesResolver],
  exports: [PayrollCyclesService],
})
export class PayrollCyclesModule {}
