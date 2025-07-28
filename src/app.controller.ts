import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // ROLE REFRESH
  @Get('/role-refresh')
  async roleRefresh() {
    await this.appService.roleRefresh();
    return 'Roles refreshed';
  }

  // SETUP
  @Get('/seed-super-admin')
  async seedSuperAdmin() {
    await this.appService.seedSuperAdmin();
    return 'Super admin created';
  }

  // SETUP
  @Get('/setup')
  async setup() {
    await this.appService.setup();
    return 'Super admin created';
  }
}
