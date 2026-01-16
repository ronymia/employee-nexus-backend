import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { WorkSitesService } from './work-sites.service';
import {
  WorkSite,
  WorkSiteResponse,
  WorkSitesQueryResponse,
} from './entities/work-site.entity';
import { CreateWorkSiteInput } from './dto/create-work-site.input';
import { UpdateWorkSiteInput } from './dto/update-work-site.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QueryWorkSiteInput } from './dto/query-work-site.input';

@Resolver(() => WorkSite)
export class WorkSitesResolver {
  constructor(private readonly workSitesService: WorkSitesService) {}

  // CREATE WORK SITE
  @Mutation(() => WorkSiteResponse, { name: 'createWorkSite' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Site:create')
  @UseGuards(GqlAuthGuard)
  async createWorkSite(
    @Args('createWorkSiteInput') createWorkSiteInput: CreateWorkSiteInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.workSitesService.create({
      user,
      createWorkSiteInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Work Site created successfully`,
      data: result,
    };
  }

  // FIND ALL WORK SITES
  @Query(() => WorkSitesQueryResponse, { name: 'workSites' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Site:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryWorkSiteInput,
  ) {
    const result = await this.workSitesService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Work Sites retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE WORK SITE
  @Query(() => WorkSiteResponse, { name: 'workSiteById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Site:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.workSitesService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Work Site retrieved successfully`,
      data: result,
    };
  }

  // UPDATE WORK SITE
  @Mutation(() => WorkSiteResponse, { name: 'updateWorkSite' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Site:update')
  @UseGuards(GqlAuthGuard)
  async updateWorkSite(
    @CurrentUser() user: JwtPayload,
    @Args('updateWorkSiteInput') updateWorkSiteInput: UpdateWorkSiteInput,
  ) {
    const result = await this.workSitesService.update({
      user,
      id: updateWorkSiteInput.id,
      updateWorkSiteInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Work Site updated successfully`,
      data: result,
    };
  }

  // REMOVE WORK SITE
  @Mutation(() => WorkSiteResponse, { name: 'deleteWorkSite' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Site:delete')
  @UseGuards(GqlAuthGuard)
  async removeWorkSite(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.workSitesService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Work Site deleted successfully`,
      data: result,
    };
  }

  // RESOLVE IS_DEFAULT FIELD
  @ResolveField(() => Boolean, { name: 'isDefault' })
  async isDefault(
    @Parent() workSite: WorkSite,
    @CurrentUser() user: JwtPayload,
  ): Promise<boolean> {
    return await this.workSitesService.isDefault({
      workSiteId: workSite.id,
      businessId: user.businessId,
    });
  }
}
