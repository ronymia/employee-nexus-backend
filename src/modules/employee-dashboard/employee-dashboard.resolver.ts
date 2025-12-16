import { Resolver, Query } from '@nestjs/graphql';
import { EmployeeDashboardService } from './employee-dashboard.service';
import {
  EmployeeDashboard,
  EmployeeDashboardResponse,
} from './entities/employee-dashboard.entity';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => EmployeeDashboard)
export class EmployeeDashboardResolver {
  constructor(
    private readonly employeeDashboardService: EmployeeDashboardService,
  ) {}

  @Query(() => EmployeeDashboardResponse, { name: 'employeeDashboard' })
  @UseGuards(GqlAuthGuard)
  async getEmployeeDashboard(@CurrentUser() user: JwtPayload) {
    const result = await this.employeeDashboardService.getEmployeeDashboard(
      user.userId,
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Dashboard retrieved successfully',
      data: result,
    };
  }
}
