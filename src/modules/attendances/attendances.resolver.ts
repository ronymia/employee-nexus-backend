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
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class AttendancesResolver {
  constructor(private readonly attendancesService: AttendancesService) {}

  // CREATE ATTENDANCE
  @Mutation(() => AttendanceResponse)
  @RequirePermissions('Attendance:create')
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
  @RequirePermissions('Attendance:read')
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
  @Query(() => AttendanceResponse, { name: 'attendanceById' })
  @RequirePermissions('Attendance:read')
  async findOne(
    // @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    const result = await this.attendancesService.findOne({ id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Attendance retrieved successfully',
      data: result,
    };
  }

  // UPDATE ATTENDANCE
  @Mutation(() => AttendanceResponse)
  @RequirePermissions('Attendance:update')
  async updateAttendance(
    // @CurrentUser() user: JwtPayload,
    @Args('updateAttendanceInput') updateAttendanceInput: UpdateAttendanceInput,
  ) {
    const result = await this.attendancesService.update({
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
  @Mutation(() => AttendanceResponse, { name: 'deleteAttendance' })
  @RequirePermissions('Attendance:delete')
  async removeAttendance(
    // @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    const result = await this.attendancesService.remove({ id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Attendance deleted successfully',
      data: result,
    };
  }

  // CREATE PUNCH RECORD
  @Mutation(() => AttendancePunch)
  @RequirePermissions('Attendance:create')
  async createAttendancePunch(
    // @CurrentUser() user: JwtPayload,
    @Args('createAttendancePunchInput')
    createAttendancePunchInput: CreateAttendancePunchInput,
  ) {
    return await this.attendancesService.createPunch({
      createAttendancePunchInput,
    });
  }

  // UPDATE PUNCH RECORD
  @Mutation(() => AttendancePunch)
  @RequirePermissions('Attendance:update')
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
  @RequirePermissions('Attendance:delete')
  async removeAttendancePunch(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return await this.attendancesService.removePunch({ user, id });
  }
}
