import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesResolver } from './attendances.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AttendancesResolver, AttendancesService],
})
export class AttendancesModule {}
