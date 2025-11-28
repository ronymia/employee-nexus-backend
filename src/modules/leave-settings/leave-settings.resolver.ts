// LEAVE SETTINGS RESOLVER - HANDLES GRAPHQL OPERATIONS FOR LEAVE SETTING MANAGEMENT
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LeaveSettingsService } from './leave-settings.service';
import {
  LeaveSetting,
  LeaveSettingResponse,
} from './entities/leave-setting.entity';
import { UpdateLeaveSettingInput } from './dto/update-leave-setting.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => LeaveSetting)
export class LeaveSettingsResolver {
  // LEAVE SETTINGS SERVICE INJECTION
  constructor(private readonly leaveSettingsService: LeaveSettingsService) {}

  // FIND LEAVE SETTINGS BY BUSINESS QUERY
  @Query(() => LeaveSettingResponse, {
    name: 'leaveSettingByBusinessId',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Leave Settings:read')
  @UseGuards(GqlAuthGuard)
  async findByBusiness(@CurrentUser() user: JwtPayload) {
    const result = await this.leaveSettingsService.findByBusiness({
      user,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leave settings retrieved successfully`,
      data: result,
    };
  }

  // UPDATE LEAVE SETTING MUTATION
  @Mutation(() => LeaveSettingResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Leave Settings:update')
  @UseGuards(GqlAuthGuard)
  async updateLeaveSetting(
    @CurrentUser() user: JwtPayload,
    @Args('updateLeaveSettingInput')
    updateLeaveSettingInput: UpdateLeaveSettingInput,
  ) {
    const result = await this.leaveSettingsService.update({
      user,
      updateLeaveSettingInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leave setting updated successfully`,
      data: result,
    };
  }
}
