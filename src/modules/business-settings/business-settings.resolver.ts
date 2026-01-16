// BUSINESS SETTINGS RESOLVER - HANDLES GRAPHQL OPERATIONS FOR BUSINESS SETTING MANAGEMENT
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
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
  @RequirePermissions('Business:read')
  @UseGuards(GqlAuthGuard)
  async findByBusiness(
    @Args('businessId', { type: () => Int }) businessId: number,
  ) {
    const result = await this.businessSettingsService.findByBusiness({
      businessId,
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
  @RequirePermissions('Business:update')
  @UseGuards(GqlAuthGuard)
  async updateBusinessSetting(
    @Args('businessId', { type: () => Int }) businessId: number,
    @Args('updateBusinessSettingInput')
    updateBusinessSettingInput: UpdateBusinessSettingInput,
  ) {
    const result = await this.businessSettingsService.update({
      businessId,
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
