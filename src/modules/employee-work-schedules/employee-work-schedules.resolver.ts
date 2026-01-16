import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EmployeeWorkSchedulesService } from './employee-work-schedules.service';
import {
  EmployeeWorkSchedule,
  EmployeeWorkScheduleResponse,
} from './entities/employee-work-schedule.entity';
import { AssignEmployeeScheduleInput } from './dto/assign-employee-schedule.input';
import { GetEmployeeSchedulesInput } from './dto/get-employee-schedules.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => EmployeeWorkSchedule)
@UseGuards(GqlAuthGuard)
export class EmployeeWorkSchedulesResolver {
  constructor(
    private readonly employeeWorkSchedulesService: EmployeeWorkSchedulesService,
  ) {}

  // ASSIGN WORK SCHEDULE TO EMPLOYEE
  @Mutation(() => EmployeeWorkScheduleResponse, {
    description: 'Assign a work schedule to an employee',
  })
  async assignEmployeeSchedule(
    @CurrentUser() user: JwtPayload,
    @Args('assignEmployeeScheduleInput')
    assignEmployeeScheduleInput: AssignEmployeeScheduleInput,
  ) {
    const result =
      await this.employeeWorkSchedulesService.assignEmployeeSchedule({
        user,
        assignEmployeeScheduleInput,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee schedule assigned successfully',
      data: result,
    };
  }

  // GET EMPLOYEE WORK SCHEDULES
  @Query(() => EmployeeWorkScheduleResponse, {
    name: 'getEmployeeSchedules',
    description: 'Get employee work schedules with optional filters',
  })
  async getEmployeeSchedules(
    @CurrentUser() user: JwtPayload,
    @Args('getEmployeeSchedulesInput', { nullable: true })
    getEmployeeSchedulesInput?: GetEmployeeSchedulesInput,
  ) {
    const result = await this.employeeWorkSchedulesService.getEmployeeSchedules(
      {
        user,
        getEmployeeSchedulesInput,
      },
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee schedules retrieved successfully',
      data: result,
    };
  }
}
