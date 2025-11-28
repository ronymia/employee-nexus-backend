import { Module } from '@nestjs/common';
import { WorkSitesService } from './work-sites.service';
import { WorkSitesResolver } from './work-sites.resolver';

@Module({
  providers: [WorkSitesResolver, WorkSitesService],
})
export class WorkSitesModule {}
