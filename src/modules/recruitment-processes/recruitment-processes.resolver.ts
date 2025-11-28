import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RecruitmentProcessesService } from './recruitment-processes.service';
import {
  RecruitmentProcess,
  RecruitmentProcessResponse,
  RecruitmentProcessesQueryResponse,
} from './entities/recruitment-process.entity';
import { CreateRecruitmentProcessInput } from './dto/create-recruitment-process.input';
import { UpdateRecruitmentProcessInput } from './dto/update-recruitment-process.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QueryRecruitmentProcessInput } from './dto/query-recruitment-process.input';

@Resolver(() => RecruitmentProcess)
export class RecruitmentProcessesResolver {
  constructor(
    private readonly recruitmentProcessesService: RecruitmentProcessesService,
  ) {}

  // CREATE RECRUITMENT PROCESS
  @Mutation(() => RecruitmentProcessResponse, {
    name: 'createRecruitmentProcess',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Recruitment Process:create')
  @UseGuards(GqlAuthGuard)
  async createRecruitmentProcess(
    @Args('createRecruitmentProcessInput')
    createRecruitmentProcessInput: CreateRecruitmentProcessInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.recruitmentProcessesService.create({
      user,
      createRecruitmentProcessInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Recruitment Process created successfully`,
      data: result,
    };
  }

  // FIND ALL RECRUITMENT PROCESSES
  @Query(() => RecruitmentProcessesQueryResponse, {
    name: 'recruitmentProcesses',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Recruitment Process:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryRecruitmentProcessInput,
  ) {
    const result = await this.recruitmentProcessesService.findAll({
      user,
      query,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Recruitment Processes retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE RECRUITMENT PROCESS
  @Query(() => RecruitmentProcessResponse, { name: 'recruitmentProcessById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Recruitment Process:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.recruitmentProcessesService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Recruitment Process retrieved successfully`,
      data: result,
    };
  }

  // UPDATE RECRUITMENT PROCESS
  @Mutation(() => RecruitmentProcessResponse, {
    name: 'updateRecruitmentProcess',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Recruitment Process:update')
  @UseGuards(GqlAuthGuard)
  async updateRecruitmentProcess(
    @CurrentUser() user: JwtPayload,
    @Args('updateRecruitmentProcessInput')
    updateRecruitmentProcessInput: UpdateRecruitmentProcessInput,
  ) {
    const result = await this.recruitmentProcessesService.update({
      user,
      id: updateRecruitmentProcessInput.id,
      updateRecruitmentProcessInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Recruitment Process updated successfully`,
      data: result,
    };
  }

  // REMOVE RECRUITMENT PROCESS
  @Mutation(() => RecruitmentProcessResponse, {
    name: 'deleteRecruitmentProcess',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Recruitment Process:delete')
  @UseGuards(GqlAuthGuard)
  async removeRecruitmentProcess(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.recruitmentProcessesService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Recruitment Process deleted successfully`,
      data: result,
    };
  }
}
