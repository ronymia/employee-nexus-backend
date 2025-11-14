import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OnboardingProcessesService } from './onboarding-processes.service';
import {
  OnboardingProcess,
  OnboardingProcessResponse,
  OnboardingProcessesQueryResponse,
} from './entities/onboarding-process.entity';
import { CreateOnboardingProcessInput } from './dto/create-onboarding-process.input';
import { UpdateOnboardingProcessInput } from './dto/update-onboarding-process.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QueryOnboardingProcessInput } from './dto/query-onboarding-process.input';

@Resolver(() => OnboardingProcess)
export class OnboardingProcessesResolver {
  constructor(
    private readonly onboardingProcessesService: OnboardingProcessesService,
  ) {}

  // CREATE ONBOARDING PROCESS
  @Mutation(() => OnboardingProcessResponse, {
    name: 'createOnboardingProcess',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Onboarding Process:create')
  @UseGuards(GqlAuthGuard)
  async createOnboardingProcess(
    @Args('createOnboardingProcessInput')
    createOnboardingProcessInput: CreateOnboardingProcessInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.onboardingProcessesService.create({
      user,
      createOnboardingProcessInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Onboarding Process created successfully`,
      data: result,
    };
  }

  // FIND ALL ONBOARDING PROCESSES
  @Query(() => OnboardingProcessesQueryResponse, {
    name: 'onboardingProcesses',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Onboarding Process:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryOnboardingProcessInput,
  ) {
    const result = await this.onboardingProcessesService.findAll({
      user,
      query,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Onboarding Processes retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE ONBOARDING PROCESS
  @Query(() => OnboardingProcessResponse, { name: 'onboardingProcessById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Onboarding Process:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.onboardingProcessesService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Onboarding Process retrieved successfully`,
      data: result,
    };
  }

  // UPDATE ONBOARDING PROCESS
  @Mutation(() => OnboardingProcessResponse, {
    name: 'updateOnboardingProcess',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Onboarding Process:update')
  @UseGuards(GqlAuthGuard)
  async updateOnboardingProcess(
    @CurrentUser() user: JwtPayload,
    @Args('updateOnboardingProcessInput')
    updateOnboardingProcessInput: UpdateOnboardingProcessInput,
  ) {
    const result = await this.onboardingProcessesService.update({
      user,
      id: updateOnboardingProcessInput.id,
      updateOnboardingProcessInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Onboarding Process updated successfully`,
      data: result,
    };
  }

  // REMOVE ONBOARDING PROCESS
  @Mutation(() => OnboardingProcessResponse, {
    name: 'deleteOnboardingProcess',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Onboarding Process:delete')
  @UseGuards(GqlAuthGuard)
  async removeOnboardingProcess(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.onboardingProcessesService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Onboarding Process deleted successfully`,
      data: result,
    };
  }
}
