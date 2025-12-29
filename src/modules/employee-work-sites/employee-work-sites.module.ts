import { Module } from '@nestjs/common';
import { EmployeeWorkSitesService } from './employee-work-sites.service';
import { EmployeeWorkSitesResolver } from './employee-work-sites.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EmployeeWorkSitesResolver, EmployeeWorkSitesService],
})
export class EmployeeWorkSitesModule {}
