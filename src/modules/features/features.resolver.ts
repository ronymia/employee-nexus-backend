import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { FeaturesService } from './features.service';
import {
  Feature,
  FeatureResponse,
  FeatureQueryResponse,
} from './entities/features.entity';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';

@Resolver(() => Feature)
export class FeaturesResolver {
  constructor(private readonly featuresService: FeaturesService) {}

  // FIND ALL MODULES
  @Query(() => FeatureQueryResponse, { name: 'allFeatures' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Feature:read')
  @UseGuards(GqlAuthGuard)
  async findAll() {
    const result = await this.featuresService.findAll();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Features retrieved successfully`,
      data: result,
    };
  }

  // FIND BY ID MODULE
  @Query(() => FeatureResponse, { name: 'FeatureById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Feature:read')
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const result = await this.featuresService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Feature retrieved successfully`,
      data: result,
    };
  }
}
