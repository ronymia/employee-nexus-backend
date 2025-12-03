import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BusinessSchedulesService } from './business-schedules.service';
import {
  BusinessSchedule,
  BusinessScheduleResponse,
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

  @Query(() => BusinessSchedule, { name: 'businessScheduleByBusinessId' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.businessSchedulesService.findOne(id);
  }

  @Mutation(() => BusinessScheduleResponse, { name: 'updateBusinessSchedule' })
  @UseGuards(GqlAuthGuard)
  async updateBusinessSchedule(
    @CurrentUser() user: JwtPayload,
    @Args('updateBusinessScheduleInput') data: UpdateBusinessScheduleInput,
  ) {
    const result = await this.businessSchedulesService.update({
      user,
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
