import { Module } from '@nestjs/common';
import { SocialLinksService } from './social-links.service';
import { SocialLinksResolver } from './social-links.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SocialLinksResolver, SocialLinksService],
})
export class SocialLinksModule {}
