import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AttendancesService } from './attendances.service';
import {
  Attendance,
  AttendanceResponse,
  AttendanceQueryResponse,
} from './entities/attendance.entity';
import { AttendancePunch } from './entities/attendance-punch.entity';
import { CreateAttendanceInput } from './dto/create-attendance.input';
import { UpdateAttendanceInput } from './dto/update-attendance.input';
import { QueryAttendanceInput } from './dto/query-attendance.input';
import { CreateAttendancePunchInput } from './dto/create-attendance-punch.input';
import { UpdateAttendancePunchInput } from './dto/update-attendance-punch.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => Attendance)
export class AttendancesResolver {
  constructor(private readonly attendancesService: AttendancesService) {}

  // CREATE ATTENDANCE
  @Mutation(() => AttendanceResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:create')
  @UseGuards(GqlAuthGuard)
  async createAttendance(
    @CurrentUser() user: JwtPayload,
    @Args('createAttendanceInput') createAttendanceInput: CreateAttendanceInput,
  ) {
    const result = await this.attendancesService.create({
      user,
      createAttendanceInput,
    });

    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Attendance created successfully',
      data: result,
    };
  }

  // QUERY ALL ATTENDANCES
  @Query(() => AttendanceQueryResponse, { name: 'attendances' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query?: QueryAttendanceInput,
  ) {
    const result = await this.attendancesService.findAll({
      user,
      query: query ?? {},
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Attendances retrieved successfully',
      ...result,
    };
  }

  // QUERY SINGLE ATTENDANCE
  @Query(() => AttendanceResponse, { name: 'attendance' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    const result = await this.attendancesService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Attendance retrieved successfully',
      data: result,
    };
  }

  // UPDATE ATTENDANCE
  @Mutation(() => AttendanceResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:update')
  @UseGuards(GqlAuthGuard)
  async updateAttendance(
    @CurrentUser() user: JwtPayload,
    @Args('updateAttendanceInput') updateAttendanceInput: UpdateAttendanceInput,
  ) {
    const result = await this.attendancesService.update({
      user,
      updateAttendanceInput,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Attendance updated successfully',
      data: result,
    };
  }

  // DELETE ATTENDANCE
  @Mutation(() => AttendanceResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:delete')
  @UseGuards(GqlAuthGuard)
  async removeAttendance(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    const result = await this.attendancesService.remove({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Attendance deleted successfully',
      data: result,
    };
  }

  // CREATE PUNCH RECORD
  @Mutation(() => AttendancePunch)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:create')
  @UseGuards(GqlAuthGuard)
  async createAttendancePunch(
    @CurrentUser() user: JwtPayload,
    @Args('createAttendancePunchInput')
    createAttendancePunchInput: CreateAttendancePunchInput,
  ) {
    return await this.attendancesService.createPunch({
      user,
      createAttendancePunchInput,
    });
  }

  // UPDATE PUNCH RECORD
  @Mutation(() => AttendancePunch)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:update')
  @UseGuards(GqlAuthGuard)
  async updateAttendancePunch(
    @CurrentUser() user: JwtPayload,
    @Args('updateAttendancePunchInput')
    updateAttendancePunchInput: UpdateAttendancePunchInput,
  ) {
    return await this.attendancesService.updatePunch({
      user,
      updateAttendancePunchInput,
    });
  }

  // DELETE PUNCH RECORD
  @Mutation(() => AttendancePunch)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:delete')
  @UseGuards(GqlAuthGuard)
  async removeAttendancePunch(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return await this.attendancesService.removePunch({ user, id });
  }
}
