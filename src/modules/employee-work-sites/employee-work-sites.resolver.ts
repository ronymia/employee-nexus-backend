import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmployeeWorkSitesService } from './employee-work-sites.service';
import {
  EmployeeWorkSite,
  EmployeeWorkSiteResponse,
  EmployeeWorkSitesArrayResponse,
} from './entities/employee-work-site.entity';
import {
  AssignEmployeeWorkSiteInput,
  UpdateEmployeeWorkSiteInput,
} from './dto/assign-employee-work-site.input';
import { QueryEmployeeWorkSitesInput } from './dto/query-employee-work-sites.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => EmployeeWorkSite)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class EmployeeWorkSitesResolver {
  constructor(
    private readonly employeeWorkSitesService: EmployeeWorkSitesService,
  ) {}

  // ASSIGN WORK SITE TO EMPLOYEE
  @Mutation(() => EmployeeWorkSiteResponse, {
    description: 'Assign a work site to an employee',
  })
  @RequirePermissions('Work Site:create')
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
    @Args('queryEmployeeWorkSitesInput', { nullable: true })
    queryEmployeeWorkSitesInput?: QueryEmployeeWorkSitesInput,
  ) {
    const result = await this.employeeWorkSitesService.getEmployeeWorkSites({
      user,
      queryEmployeeWorkSitesInput,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee work sites retrieved successfully',
      data: result,
    };
  }

  // GET WORK SITE HISTORY FOR USER
  @Query(() => EmployeeWorkSitesArrayResponse, {
    name: 'workSiteHistory',
    description: 'Get complete work site history for an employee',
  })
  async getWorkSiteHistory(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.employeeWorkSitesService.getWorkSiteHistory({
      user,
      userId,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Work site history retrieved successfully',
      data: result,
    };
  }

  // GET ACTIVE WORK SITES FOR USER
  @Query(() => EmployeeWorkSitesArrayResponse, {
    name: 'getActiveWorkSites',
    description: 'Get active work sites for an employee',
  })
  async getActiveWorkSites(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.employeeWorkSitesService.getActiveWorkSites({
      user,
      userId,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Active work sites retrieved successfully',
      data: result,
    };
  }

  // GET WORK SITE BY COMPOSITE ID
  @Query(() => EmployeeWorkSiteResponse, {
    name: 'getWorkSiteById',
    description: 'Get specific work site assignment by composite ID',
  })
  async getWorkSiteById(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('workSiteId', { type: () => Int }) workSiteId: number,
  ) {
    const result = await this.employeeWorkSitesService.getByCompositeId({
      user,
      userId,
      workSiteId,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Work site assignment retrieved successfully',
      data: result,
    };
  }

  // UPDATE EMPLOYEE WORK SITE
  @Mutation(() => EmployeeWorkSiteResponse, {
    description: 'Update an employee work site assignment',
  })
  async updateEmployeeWorkSite(
    @CurrentUser() user: JwtPayload,
    @Args('updateEmployeeWorkSiteInput')
    updateEmployeeWorkSiteInput: UpdateEmployeeWorkSiteInput,
  ) {
    const result = await this.employeeWorkSitesService.updateEmployeeWorkSite({
      user,
      userId: updateEmployeeWorkSiteInput.userId,
      workSiteId: updateEmployeeWorkSiteInput.workSiteId,
      updateData: updateEmployeeWorkSiteInput,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee work site updated successfully',
      data: result,
    };
  }
}
