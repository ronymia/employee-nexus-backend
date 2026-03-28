import { Controller, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('seeder')
@UseGuards(JwtAuthGuard)
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Get('seed-demo-business')
  @HttpCode(HttpStatus.OK)
  async seedDemoBusiness() {
    return await this.seederService.seedDemoBusiness();
  }

  @Get('run-migrations')
  @HttpCode(HttpStatus.OK)
  async runMigrations() {
    return await this.seederService.runMigrations();
  }

  @Get('reset-database')
  @HttpCode(HttpStatus.OK)
  async resetDatabase() {
    return await this.seederService.resetDatabase();
  }
}
