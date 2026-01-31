import { Controller, Post, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Get('seed-demo-business')
  @HttpCode(HttpStatus.OK)
  async seedDemoBusiness() {
    return await this.seederService.seedDemoBusiness();
  }

  @Post('run-migrations')
  @HttpCode(HttpStatus.OK)
  async runMigrations() {
    return await this.seederService.runMigrations();
  }
}
