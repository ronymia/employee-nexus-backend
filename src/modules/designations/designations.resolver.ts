import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DesignationsService } from './designations.service';
import {
  Designation,
  DesignationResponse,
  DesignationsQueryResponse,
} from './entities/designation.entity';
import { CreateDesignationInput } from './dto/create-designation.input';
import { UpdateDesignationInput } from './dto/update-designation.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryDesignationInput } from './dto/query-designation.input';

@Resolver(() => Designation)
export class DesignationsResolver {
  constructor(private readonly designationsService: DesignationsService) {}

  // CREATE DESIGNATION
  @Mutation(() => DesignationResponse, { name: 'createDesignation' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Designation:create')
  @UseGuards(GqlAuthGuard)
  async createDesignation(
    @Args('createDesignationInput')
    createDesignationInput: CreateDesignationInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.designationsService.create(
      user,
      createDesignationInput,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Designation created successfully`,
      data: result,
    };
  }

  // FIND ALL DESIGNATIONS
  @Query(() => DesignationsQueryResponse, { name: 'designations' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Designation:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryDesignationInput,
  ) {
    const result = await this.designationsService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Designations retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE DESIGNATION
  @Query(() => DesignationResponse, { name: 'designationById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Designation:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.designationsService.findOne(user, id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Designation retrieved successfully`,
      data: result,
    };
  }

  // UPDATE DESIGNATION
  @Mutation(() => DesignationResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Designation:update')
  @UseGuards(GqlAuthGuard)
  async updateDesignation(
    @CurrentUser() user: JwtPayload,
    @Args('updateDesignationInput')
    updateDesignationInput: UpdateDesignationInput,
  ) {
    const result = await this.designationsService.update(
      user,
      updateDesignationInput.id,
      updateDesignationInput,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Designation updated successfully`,
      data: result,
    };
  }

  // DELETE DESIGNATION
  @Mutation(() => DesignationResponse, { name: 'deleteDesignation' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Designation:delete')
  @UseGuards(GqlAuthGuard)
  async removeDesignation(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.designationsService.remove(user, id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Designation deleted successfully`,
      data: result,
    };
  }
}
