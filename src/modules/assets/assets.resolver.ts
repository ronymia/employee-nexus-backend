import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AssetsService } from './assets.service';
import {
  Asset,
  AssetResponse,
  AssetsQueryResponse,
  AssetAssignmentResponse,
  AssetAssignmentQueryResponse,
} from './entities/asset.entity';
import { CreateAssetInput } from './dto/create-asset.input';
import { UpdateAssetInput } from './dto/update-asset.input';
import { AssignAssetInput } from './dto/assign-asset.input';
import { ReturnAssetInput } from './dto/return-asset.input';
import { QueryAssetInput } from './dto/query-asset.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Asset)
export class AssetsResolver {
  constructor(private readonly assetsService: AssetsService) {}

  @Mutation(() => AssetResponse, { name: 'createAsset' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset:create')
  @UseGuards(GqlAuthGuard)
  async createAsset(
    @Args('createAssetInput') createAssetInput: CreateAssetInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.assetsService.create({
      user,
      createAssetInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Asset created successfully',
      data: result,
    };
  }

  @Query(() => AssetsQueryResponse, { name: 'assets' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query?: QueryAssetInput,
  ) {
    const result = await this.assetsService.findAll({
      user,
      query,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Assets retrieved successfully',
      data: result,
      meta: {
        total: result.length,
        page: 1,
        limit: result.length,
        totalPages: 1,
      },
    };
  }

  @Query(() => AssetsQueryResponse, { name: 'assetsByUserId' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset:read')
  @UseGuards(GqlAuthGuard)
  async findByUserId(@Args('userId', { type: () => Int }) userId: number) {
    const result = await this.assetsService.findByUserId({ userId });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Assets retrieved successfully',
      data: result,
      meta: {
        total: result.length,
        page: 1,
        limit: result.length,
        totalPages: 1,
      },
    };
  }

  @Query(() => AssetAssignmentQueryResponse, { name: 'userAssetAssignments' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset:read')
  @UseGuards(GqlAuthGuard)
  async getUserAssetAssignments(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.assetsService.getUserAssetAssignments({ userId });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'User asset assignments retrieved successfully',
      data: result,
      meta: {
        total: result.length,
        page: 1,
        limit: result.length,
        totalPages: 1,
      },
    };
  }

  @Query(() => AssetResponse, { name: 'asset' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.assetsService.findOne({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Asset retrieved successfully',
      data: result,
    };
  }

  @Mutation(() => AssetResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset:update')
  @UseGuards(GqlAuthGuard)
  async updateAsset(
    @Args('updateAssetInput') updateAssetInput: UpdateAssetInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.assetsService.update({
      user,
      updateAssetInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Asset updated successfully',
      data: result,
    };
  }

  @Mutation(() => AssetResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset:delete')
  @UseGuards(GqlAuthGuard)
  async removeAsset(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.assetsService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Asset deleted successfully',
      data: result,
    };
  }

  @Mutation(() => AssetAssignmentResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset:update')
  @UseGuards(GqlAuthGuard)
  async assignAsset(
    @Args('assignAssetInput') assignAssetInput: AssignAssetInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.assetsService.assign({
      assignAssetInput,
      user,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Asset assigned successfully',
      data: result,
    };
  }

  @Mutation(() => AssetAssignmentResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Asset:update')
  @UseGuards(GqlAuthGuard)
  async returnAsset(
    @Args('returnAssetInput') returnAssetInput: ReturnAssetInput,
  ) {
    const result = await this.assetsService.return(returnAssetInput);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Asset returned successfully',
      data: result,
    };
  }
}
