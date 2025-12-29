import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EmployeeWorkSitesService } from './employee-work-sites.service';
import {
  EmployeeWorkSite,
  EmployeeWorkSiteResponse,
} from './entities/employee-work-site.entity';
import { AssignEmployeeWorkSiteInput } from './dto/assign-employee-work-site.input';
import { GetEmployeeWorkSitesInput } from './dto/get-employee-work-sites.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => EmployeeWorkSite)
@UseGuards(GqlAuthGuard)
export class EmployeeWorkSitesResolver {
  constructor(
    private readonly employeeWorkSitesService: EmployeeWorkSitesService,
  ) {}

  // ASSIGN WORK SITE TO EMPLOYEE
  @Mutation(() => EmployeeWorkSiteResponse, {
    description: 'Assign a work site to an employee',
  })
  async assignEmployeeWorkSite(
    @CurrentUser() user: JwtPayload,
    @Args('assignEmployeeWorkSiteInput')
    assignEmployeeWorkSiteInput: AssignEmployeeWorkSiteInput,
  ) {
    const result = await this.employeeWorkSitesService.assignEmployeeWorkSite({
      user,
      assignEmployeeWorkSiteInput,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee work site assigned successfully',
      data: result,
    };
  }

  // GET EMPLOYEE WORK SITES
  @Query(() => EmployeeWorkSiteResponse, {
    name: 'getEmployeeWorkSites',
    description: 'Get employee work sites with optional filters',
  })
  async getEmployeeWorkSites(
    @CurrentUser() user: JwtPayload,
    @Args('getEmployeeWorkSitesInput', { nullable: true })
    getEmployeeWorkSitesInput?: GetEmployeeWorkSitesInput,
  ) {
    const result = await this.employeeWorkSitesService.getEmployeeWorkSites({
      user,
      getEmployeeWorkSitesInput,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee work sites retrieved successfully',
      data: result,
    };
  }
}
