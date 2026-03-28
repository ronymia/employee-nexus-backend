import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AttendancesService } from './attendances.service';
import {
  Attendance,
  AttendanceResponse,
  AttendanceQueryResponse,
} from './entities/attendance.entity';
import { QueryAttendanceInput } from './dto/query-attendance.input';
import {
  HttpStatus,
  NotAcceptableException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { AttendancePunchResponse } from './entities/attendance-punch.entity';
import { PunchInInput, PunchOutInput } from './dto/attendance-punch.input';
import { CreateAttendanceInput } from './dto/create-attendance.input';
import { UpdateAttendanceInput } from './dto/update-attendance.input';
import { AttendanceSummaryAttendanceOverview } from './entities/attendance-overview.entity';
import {
  ApproveAttendanceInput,
  RejectAttendanceInput,
} from './dto/approve-attendance.input';
import { RequestAttendanceInput } from './dto/request-attendance.input';

// Punch In/Out Input Types

@Resolver(() => Attendance)
export class AttendancesResolver {
  constructor(private readonly attendancesService: AttendancesService) {}

  // ATTENDANCE OVERVIEW
  @Query(() => AttendanceSummaryAttendanceOverview, {
    name: 'attendanceOverview',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:read')
  @UseGuards(GqlAuthGuard)
  async attendanceOverview(@CurrentUser() user: JwtPayload) {
    //
    if (!user.businessId) {
      throw new NotAcceptableException('User does not belong to any business');
    }

    //
    const result = await this.attendancesService.getAttendanceOverview({
      user,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Attendance overview retrieved successfully`,
      data: result,
    };
  }

  // CREATE ATTENDANCE
  @Mutation(() => AttendanceResponse, { name: 'requestAttendance' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:create')
  @UseGuards(GqlAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async requestAttendance(
    @Args('requestAttendanceInput')
    requestAttendanceInput: RequestAttendanceInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.attendancesService.requestAttendance({
      user,
      requestAttendanceInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Attendance created successfully`,
      data: result,
    };
  }
  // CREATE ATTENDANCE
  @Mutation(() => AttendanceResponse, { name: 'createAttendance' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:create')
  @UseGuards(GqlAuthGuard)
  async createAttendance(
    @Args('createAttendanceInput')
    createAttendanceInput: CreateAttendanceInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.attendancesService.create({
      user,
      createAttendanceInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Attendance created successfully`,
      data: result,
    };
  }

  // FIND ALL ATTENDANCES
  @Query(() => AttendanceQueryResponse, { name: 'attendances' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryAttendanceInput,
  ) {
    const result = await this.attendancesService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Attendances retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE ATTENDANCE
  @Query(() => AttendanceResponse, { name: 'attendanceById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.attendancesService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Attendance retrieved successfully`,
      data: result,
    };
  }

  // UPDATE ATTENDANCE
  @Mutation(() => AttendanceResponse, { name: 'updateAttendance' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:update')
  @UseGuards(GqlAuthGuard)
  async updateAttendance(
    @CurrentUser() user: JwtPayload,
    @Args('updateAttendanceInput')
    updateAttendanceInput: UpdateAttendanceInput,
  ) {
    const result = await this.attendancesService.update({
      user,
      updateAttendanceInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Attendance updated successfully`,
      data: result,
    };
  }

  // DELETE ATTENDANCE
  @Mutation(() => AttendanceResponse, { name: 'deleteAttendance' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:delete')
  @UseGuards(GqlAuthGuard)
  async removeAttendance(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.attendancesService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Attendance deleted successfully`,
      data: result,
    };
  }

  // GET TODAY ATTENDANCE
  @Query(() => AttendanceResponse, { name: 'getTodayAttendance' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance:read')
  @UseGuards(GqlAuthGuard)
  async getTodayAttendance(
    // @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.attendancesService.getTodayAttendance({
      user,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Attendance retrieved successfully`,
      data: result,
    };
  }

  // PUNCH IN
  @Mutation(() => AttendancePunchResponse, { name: 'punchIn' })
  @UseGuards(GqlAuthGuard)
  async punchIn(
    @CurrentUser() user: JwtPayload,
    @Args('punchInInput') punchInInput: PunchInInput,
  ) {
    const result = await this.attendancesService.punchIn({
      user,
      data: punchInInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Punched in successfully`,
      data: result,
    };
  }

  // PUNCH OUT
  @Mutation(() => AttendancePunchResponse, { name: 'punchOut' })
  @UseGuards(GqlAuthGuard)
  async punchOut(
    @CurrentUser() user: JwtPayload,
    @Args('punchOutInput') punchOutInput: PunchOutInput,
  ) {
    const { punchId, ...data } = punchOutInput;
    const result = await this.attendancesService.punchOut({
      user,
      punchId,
      data,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Punched out successfully`,
      data: result,
    };
  }

  // APPROVE ATTENDANCE
  @Mutation(() => AttendanceResponse, { name: 'approveAttendance' })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions('Attendance:update')
  async approveAttendance(
    @CurrentUser() user: JwtPayload,
    @Args('approveAttendanceInput')
    approveAttendanceInput: ApproveAttendanceInput,
  ) {
    const result = await this.attendancesService.approveAttendance({
      user,
      approveAttendanceInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Attendance approved successfully`,
      data: result,
    };
  }
  // APPROVE ATTENDANCE
    // APPROVE ATTENDANCE
  @Mutation(() => AttendanceResponse, { name: 'rejectAttendance' })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions('Attendance:update')
  async rejectAttendance(
    @CurrentUser() user: JwtPayload,
    @Args('rejectAttendanceInput') rejectAttendanceInput: RejectAttendanceInput,
  ) {
    const result = await this.attendancesService.rejectAttendance({
      user,
      rejectAttendanceInput: rejectAttendanceInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Attendance rejected successfully`,
      data: result,
    };
  }

  // RESOLVE FIELD: scheduleMinutes
  @ResolveField(() => Int, {
    description: 'Total work schedule minutes for the day',
  })
  async scheduleMinutes(@Parent() attendance: Attendance) {
    return await this.attendancesService.calculateScheduleMinutes(
      attendance.userId,
      attendance.date,
    );
  }
}
