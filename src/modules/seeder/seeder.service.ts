import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { seedBusinessWithUsers } from 'src/Database/seed-business-with-users';
import configuration from 'src/config/configuration';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  async seedDemoBusiness() {
    if (configuration().node_env === 'production') {
      throw new HttpException(
        'Seeding is not allowed in production',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const result = await seedBusinessWithUsers();

      return {
        success: true,
        message: 'Demo business seeded successfully',
        data: {
          business: result.business.name,
          owner: result.owner.email,
          totalUsers:
            1 + result.adminCount + result.managerCount + result.employeeCount,
          departments: result.departments,
        },
      };
    } catch (error) {
      this.logger.error('Failed to seed demo business', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to seed demo business',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async runMigrations() {
    if (configuration().node_env === 'production') {
      throw new HttpException(
        'Running migrations via API is not allowed in production',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const { stdout } = await execAsync('yarn prisma migrate dev', {
        cwd: process.cwd(),
      });

      return {
        success: true,
        message: 'Migrations executed successfully',
        data: {
          output: stdout,
        },
      };
    } catch (error) {
      this.logger.error('Failed to run migrations', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to run migrations',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetDatabase() {
    if (configuration().node_env === 'production') {
      throw new HttpException(
        'Resetting the database via API is not allowed in production',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const { stdout } = await execAsync(
        'yarn prisma migrate reset --force',
        {
          cwd: process.cwd(),
        },
      );

      return {
        success: true,
        message: 'Database reset successfully',
        data: {
          output: stdout,
        },
      };
    } catch (error) {
      this.logger.error('Failed to reset database', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to reset database',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
