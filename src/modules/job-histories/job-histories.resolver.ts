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
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => JobHistory)
export class JobHistoriesResolver {
  constructor(private readonly jobHistoriesService: JobHistoriesService) {}

  // CREATE JOB HISTORY
  @Mutation(() => JobHistoryResponse, {
    name: 'createJobHistory',
  })
  @UseGuards(GqlAuthGuard)
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
    name: 'jobHistories',
  })
  @UseGuards(GqlAuthGuard)
  async findAll(@CurrentUser() user: JwtPayload) {
    const result = await this.jobHistoriesService.findAll({ user });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job histories retrieved successfully`,
      data: result,
    };
  }

  // FIND ONE JOB HISTORY
  @Query(() => JobHistoryResponse, { name: 'jobHistory' })
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.jobHistoriesService.findOne({ user, id });

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
  @UseGuards(GqlAuthGuard)
  async updateJobHistory(
    @CurrentUser() user: JwtPayload,
    @Args('updateJobHistoryInput')
    updateJobHistoryInput: UpdateJobHistoryInput,
  ) {
    const result = await this.jobHistoriesService.update({
      user,
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
  @UseGuards(GqlAuthGuard)
  async removeJobHistory(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.jobHistoriesService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Job history deleted successfully`,
      data: result,
    };
  }
}
