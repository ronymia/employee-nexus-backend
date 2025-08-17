import { Module } from '@nestjs/common';
import { DesignationsService } from './designations.service';
import { DesignationsResolver } from './designations.resolver';

@Module({
  providers: [DesignationsResolver, DesignationsService],
})
export class DesignationsModule {}
