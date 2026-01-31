import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JobHistoriesService } from './job-histories.service';
import {
  JobHistory,
  JobHistoryResponse,
  JobHistoriesQueryResponse,
} from './entities/job-history.entity';
import { CreateJobHistoryInput } from './dto/create-job-history.input';
import { UpdateJobHistoryInput } from './dto/update-job-history.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => JobHistory)
export class JobHistoriesResolver {
  constructor(private readonly jobHistoriesService: JobHistoriesService) {}

  // CREATE JOB HISTORY
  @Mutation(() => JobHistoryResponse, {
    name: 'createJobHistory',
  })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions('Job History:create')
  async createJobHistory(
    @Args('createJobHistoryInput')
    createJobHistoryInput: CreateJobHistoryInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.jobHistoriesService.create({
      user,
      createJobHistoryInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: `Job history created successfully`,
      data: result,
    };
  }

  // FIND ALL JOB HISTORIES
  @Query(() => JobHistoriesQueryResponse, {
    name: 'jobHistoryByUserId',
  })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions('Job History:read')
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.jobHistoriesService.findAll({ userId });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job histories retrieved successfully`,
      data: result,
    };
  }

  // FIND ONE JOB HISTORY
  @Query(() => JobHistoryResponse, { name: 'jobHistory' })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions('Job History:read')
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.jobHistoriesService.findOne({ userId, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job history retrieved successfully`,
      data: result,
    };
  }

  // UPDATE JOB HISTORY
  @Mutation(() => JobHistoryResponse, {
    name: 'updateJobHistory',
  })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions('Job History:update')
  async updateJobHistory(
    @Args('updateJobHistoryInput')
    updateJobHistoryInput: UpdateJobHistoryInput,
  ) {
    const result = await this.jobHistoriesService.update({
      id: updateJobHistoryInput.id,
      updateJobHistoryInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job history updated successfully`,
      data: result,
    };
  }

  // REMOVE JOB HISTORY
  @Mutation(() => JobHistoryResponse, {
    name: 'deleteJobHistory',
  })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions('Job History:delete')
  async removeJobHistory(
    @Args('id', { type: () => Int }) id: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.jobHistoriesService.remove({ userId, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job history deleted successfully`,
      data: result,
    };
  }
}
