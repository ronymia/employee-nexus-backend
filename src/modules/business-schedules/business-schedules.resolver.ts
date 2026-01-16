import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BusinessSchedulesService } from './business-schedules.service';
import {
  BusinessSchedule,
  BusinessScheduleResponse,
  BusinessScheduleQueryResponse,
} from './entities/business-schedule.entity';
import { UpdateBusinessScheduleInput } from './dto/update-business-schedule.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => BusinessSchedule)
export class BusinessSchedulesResolver {
  constructor(
    private readonly businessSchedulesService: BusinessSchedulesService,
  ) {}

  @Query(() => BusinessSchedule, { name: 'businessScheduleById' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const result = await this.businessSchedulesService.findOne(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Business schedule retrieve successfully',
      data: result,
    };
  }

  @Query(() => BusinessScheduleQueryResponse, {
    name: 'businessSchedulesByBusinessId',
  })
  @UseGuards(GqlAuthGuard)
  async findByBusinessId(
    @Args('businessId', { type: () => Int }) businessId: number,
  ) {
    const result =
      await this.businessSchedulesService.findByBusinessId(businessId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Business schedules updated successfully',
      data: result,
    };
  }

  @Mutation(() => BusinessScheduleResponse, { name: 'updateBusinessSchedule' })
  @UseGuards(GqlAuthGuard)
  async updateBusinessSchedule(
    @Args('businessId', { type: () => Int }) businessId: number,
    @Args('updateBusinessScheduleInput') data: UpdateBusinessScheduleInput,
  ) {
    const result = await this.businessSchedulesService.update({
      businessId,
      updateBusinessScheduleInput: data,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Business schedule updated successfully',
      data: result,
    };
  }
}
