import { ConsoleLogger, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new ConsoleLogger(PrismaService.name);
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Database connection failed:', error);
    }
  }
}
