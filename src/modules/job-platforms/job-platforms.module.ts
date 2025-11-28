import { Module } from '@nestjs/common';
import { JobPlatformsService } from './job-platforms.service';
import { JobPlatformsResolver } from './job-platforms.resolver';

@Module({
  providers: [JobPlatformsResolver, JobPlatformsService],
})
export class JobPlatformsModule {}
