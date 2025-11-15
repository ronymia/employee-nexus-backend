// BUSINESS SETTINGS RESOLVER - HANDLES GRAPHQL OPERATIONS FOR BUSINESS SETTING MANAGEMENT
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BusinessSettingsService } from './business-settings.service';
import {
  BusinessSetting,
  BusinessSettingResponse,
} from './entities/business-setting.entity';
import { UpdateBusinessSettingInput } from './dto/update-business-setting.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => BusinessSetting)
export class BusinessSettingsResolver {
  // BUSINESS SETTINGS SERVICE INJECTION
  constructor(
    private readonly businessSettingsService: BusinessSettingsService,
  ) {}

  // FIND BUSINESS SETTINGS BY BUSINESS QUERY
  @Query(() => BusinessSettingResponse, {
    name: 'businessSettingByBusinessId',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Business Settings:read')
  @UseGuards(GqlAuthGuard)
  async findByBusiness(@CurrentUser() user: JwtPayload) {
    const result = await this.businessSettingsService.findByBusiness({
      user,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Business settings retrieved successfully`,
      data: result,
    };
  }

  // UPDATE BUSINESS SETTING MUTATION
  @Mutation(() => BusinessSettingResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Business Settings:update')
  @UseGuards(GqlAuthGuard)
  async updateBusinessSetting(
    @CurrentUser() user: JwtPayload,
    @Args('updateBusinessSettingInput')
    updateBusinessSettingInput: UpdateBusinessSettingInput,
  ) {
    const result = await this.businessSettingsService.update({
      user,
      updateBusinessSettingInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Business setting updated successfully`,
      data: result,
    };
  }
}
