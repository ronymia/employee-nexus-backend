// LEAVE TYPES MODULE - HANDLES LEAVE TYPE BUSINESS LOGIC AND GRAPHQL OPERATIONS
import { Module } from '@nestjs/common';
import { LeaveTypesService } from './leave-types.service';
import { LeaveTypesResolver } from './leave-types.resolver';

@Module({
  providers: [LeaveTypesResolver, LeaveTypesService],
})
export class LeaveTypesModule {}
