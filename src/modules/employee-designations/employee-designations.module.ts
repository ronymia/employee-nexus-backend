import { Module } from '@nestjs/common';
import { EmployeeDesignationsService } from './employee-designations.service';
import { EmployeeDesignationsResolver } from './employee-designations.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EmployeeDesignationsResolver, EmployeeDesignationsService],
})
export class EmployeeDesignationsModule {}
