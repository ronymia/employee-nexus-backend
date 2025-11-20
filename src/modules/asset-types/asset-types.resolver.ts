import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AssetTypesService } from './asset-types.service';
import {
  AssetType,
  AssetTypeResponse,
  AssetTypesQueryResponse,
} from './entities/asset-type.entity';
import { CreateAssetTypeInput } from './dto/create-asset-type.input';
import { UpdateAssetTypeInput } from './dto/update-asset-type.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QueryAssetTypeInput } from './dto/query-asset-type.input';

@Resolver(() => AssetType)
export class AssetTypesResolver {
  constructor(private readonly assetTypesService: AssetTypesService) {}

  // CREATE ASSET TYPE
  @Mutation(() => AssetTypeResponse, { name: 'createAssetType' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset Type:create')
  @UseGuards(GqlAuthGuard)
  async createAssetType(
    @Args('createAssetTypeInput') createAssetTypeInput: CreateAssetTypeInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.assetTypesService.create({
      user,
      createAssetTypeInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Asset Type created successfully`,
      data: result,
    };
  }

  // FIND ALL ASSET TYPES
  @Query(() => AssetTypesQueryResponse, { name: 'assetTypes' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset Type:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryAssetTypeInput,
  ) {
    const result = await this.assetTypesService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Asset Types retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE ASSET TYPE
  @Query(() => AssetTypeResponse, { name: 'assetType' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset Type:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    const result = await this.assetTypesService.findOne({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Asset Type retrieved successfully`,
      data: result,
    };
  }

  // UPDATE ASSET TYPE
  @Mutation(() => AssetTypeResponse, { name: 'updateAssetType' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset Type:update')
  @UseGuards(GqlAuthGuard)
  async updateAssetType(
    @Args('updateAssetTypeInput') updateAssetTypeInput: UpdateAssetTypeInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.assetTypesService.update({
      user,
      updateAssetTypeInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Asset Type updated successfully`,
      data: result,
    };
  }

  // DELETE ASSET TYPE
  @Mutation(() => AssetTypeResponse, { name: 'removeAssetType' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset Type:delete')
  @UseGuards(GqlAuthGuard)
  async removeAssetType(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    const result = await this.assetTypesService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Asset Type deleted successfully`,
      data: result,
    };
  }
}
