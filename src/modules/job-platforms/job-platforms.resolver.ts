import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JobPlatformsService } from './job-platforms.service';
import {
  JobPlatform,
  JobPlatformResponse,
  JobPlatformsQueryResponse,
} from './entities/job-platform.entity';
import { CreateJobPlatformInput } from './dto/create-job-platform.input';
import { UpdateJobPlatformInput } from './dto/update-job-platform.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QueryJobPlatformInput } from './dto/query-job-platform.input';

@Resolver(() => JobPlatform)
export class JobPlatformsResolver {
  constructor(private readonly jobPlatformsService: JobPlatformsService) {}

  // CREATE JOB PLATFORM
  @Mutation(() => JobPlatformResponse, { name: 'createJobPlatform' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Job Platform:create')
  @UseGuards(GqlAuthGuard)
  async createJobPlatform(
    @Args('createJobPlatformInput')
    createJobPlatformInput: CreateJobPlatformInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.jobPlatformsService.create({
      user,
      createJobPlatformInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job Platform created successfully`,
      data: result,
    };
  }

  // FIND ALL JOB PLATFORMS
  @Query(() => JobPlatformsQueryResponse, { name: 'jobPlatforms' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Job Platform:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryJobPlatformInput,
  ) {
    const result = await this.jobPlatformsService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job Platforms retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE JOB PLATFORM
  @Query(() => JobPlatformResponse, { name: 'jobPlatformById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Job Platform:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.jobPlatformsService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job Platform retrieved successfully`,
      data: result,
    };
  }

  // UPDATE JOB PLATFORM
  @Mutation(() => JobPlatformResponse, { name: 'updateJobPlatform' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Job Platform:update')
  @UseGuards(GqlAuthGuard)
  async updateJobPlatform(
    @CurrentUser() user: JwtPayload,
    @Args('updateJobPlatformInput')
    updateJobPlatformInput: UpdateJobPlatformInput,
  ) {
    const result = await this.jobPlatformsService.update({
      user,
      id: updateJobPlatformInput.id,
      updateJobPlatformInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job Platform updated successfully`,
      data: result,
    };
  }

  // REMOVE JOB PLATFORM
  @Mutation(() => JobPlatformResponse, { name: 'deleteJobPlatform' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Job Platform:delete')
  @UseGuards(GqlAuthGuard)
  async removeJobPlatform(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.jobPlatformsService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job Platform deleted successfully`,
      data: result,
    };
  }
}
