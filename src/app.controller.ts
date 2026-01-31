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
  @Get('/module-refresh')
  async moduleRefresh() {
    const res = await this.appService.moduleRefresh();
    return {
      success: true,
      statusCode: 200,
      message: 'Modules Updated',
      data: res,
    };
  }
  // ROLE REFRESH
  @Get('/role-permissions-refresh')
  async roleRefresh() {
    await this.appService.rolePermissionsRefresh();
    return {
      success: true,
      statusCode: 200,
      message: 'Role Permissions Updated',
    };
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
    const res = await this.appService.setup();
    return res;
  }
}
