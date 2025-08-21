import { Module } from '@nestjs/common';
import { JobTypesService } from './job-types.service';
import { JobTypesResolver } from './job-types.resolver';

@Module({
  providers: [JobTypesResolver, JobTypesService],
})
export class JobTypesModule {}
