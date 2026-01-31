import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { seedBusinessWithUsers } from 'src/Database/seed-business-with-users';
import configuration from 'src/config/configuration';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class SeederService {
  async seedDemoBusiness() {
    try {
      // Only allow in development mode for security
      if (configuration().node_env === 'production') {
        throw new HttpException(
          'Seeding is not allowed in production',
          HttpStatus.FORBIDDEN,
        );
      }

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
      throw new HttpException(
        {
          success: false,
          message: 'Failed to seed demo business',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async runMigrations() {
    try {
      // Only allow in development mode for security
      if (configuration().node_env === 'production') {
        throw new HttpException(
          'Running migrations via API is not allowed in production',
          HttpStatus.FORBIDDEN,
        );
      }

      const { stdout, stderr } = await execAsync('yarn prisma migrate dev', {
        cwd: process.cwd(),
      });

      return {
        success: true,
        message: 'Migrations executed successfully',
        data: {
          output: stdout,
          errors: stderr || null,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to run migrations',
          error: error.message,
          output: error.stdout,
          stderr: error.stderr,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
