import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JobTypesService } from './job-types.service';
import {
  JobType,
  JobTypeResponse,
  JobTypesQueryResponse,
} from './entities/job-type.entity';
import { CreateJobTypeInput } from './dto/create-job-type.input';
import { UpdateJobTypeInput } from './dto/update-job-type.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QueryJobTypeInput } from './dto/query-job-type.input';

@Resolver(() => JobType)
export class JobTypesResolver {
  constructor(private readonly jobTypesService: JobTypesService) {}

  // CREATE JOB TYPE
  @Mutation(() => JobTypeResponse, { name: 'createJobType' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Job Type:create')
  @UseGuards(GqlAuthGuard)
  async createJobType(
    @Args('createJobTypeInput') createJobTypeInput: CreateJobTypeInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.jobTypesService.create({
      user,
      createJobTypeInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job Type created successfully`,
      data: result,
    };
  }

  // FIND ALL JOB TYPES
  @Query(() => JobTypesQueryResponse, { name: 'jobTypes' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Job Type:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryJobTypeInput,
  ) {
    const result = await this.jobTypesService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job Types retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE JOB TYPE
  @Query(() => JobTypeResponse, { name: 'jobTypeById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Job Type:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.jobTypesService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job Type retrieved successfully`,
      data: result,
    };
  }

  // UPDATE JOB TYPE
  @Mutation(() => JobTypeResponse, { name: 'updateJobType' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Job Type:update')
  @UseGuards(GqlAuthGuard)
  async updateJobType(
    @CurrentUser() user: JwtPayload,
    @Args('updateJobTypeInput') updateJobTypeInput: UpdateJobTypeInput,
  ) {
    const result = await this.jobTypesService.update({
      user,
      id: updateJobTypeInput.id,
      updateJobTypeInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job Type updated successfully`,
      data: result,
    };
  }

  // REMOVE JOB TYPE
  @Mutation(() => JobTypeResponse, { name: 'deleteJobType' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Job Type:delete')
  @UseGuards(GqlAuthGuard)
  async removeJobType(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.jobTypesService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job Type deleted successfully`,
      data: result,
    };
  }
}
