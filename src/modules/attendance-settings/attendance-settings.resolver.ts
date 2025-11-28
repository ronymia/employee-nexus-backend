// ATTENDANCE SETTINGS RESOLVER - HANDLES GRAPHQL OPERATIONS FOR ATTENDANCE SETTING MANAGEMENT
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AttendanceSettingsService } from './attendance-settings.service';
import {
  AttendanceSetting,
  AttendanceSettingResponse,
} from './entities/attendance-setting.entity';
import { UpdateAttendanceSettingInput } from './dto/update-attendance-setting.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => AttendanceSetting)
export class AttendanceSettingsResolver {
  // ATTENDANCE SETTINGS SERVICE INJECTION
  constructor(
    private readonly attendanceSettingsService: AttendanceSettingsService,
  ) {}

  // FIND ATTENDANCE SETTINGS BY BUSINESS QUERY
  @Query(() => AttendanceSettingResponse, {
    name: 'attendanceSettingsByBusiness',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance Settings:read')
  @UseGuards(GqlAuthGuard)
  async findByBusiness(@CurrentUser() user: JwtPayload) {
    const result = await this.attendanceSettingsService.findByBusiness({
      user,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Attendance settings retrieved successfully`,
      data: result,
    };
  }

  // UPDATE ATTENDANCE SETTING MUTATION
  @Mutation(() => AttendanceSettingResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Attendance Settings:update')
  @UseGuards(GqlAuthGuard)
  async updateAttendanceSetting(
    @CurrentUser() user: JwtPayload,
    @Args('updateAttendanceSettingInput')
    updateAttendanceSettingInput: UpdateAttendanceSettingInput,
  ) {
    const result = await this.attendanceSettingsService.update({
      user,
      updateAttendanceSettingInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Attendance setting updated successfully`,
      data: result,
    };
  }
}
