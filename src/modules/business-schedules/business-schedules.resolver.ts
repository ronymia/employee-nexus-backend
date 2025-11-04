import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BusinessSchedulesService } from './business-schedules.service';
import { BusinessSchedule } from './entities/business-schedule.entity';
import { UpdateBusinessScheduleInput } from './dto/update-business-schedule.input';

@Resolver(() => BusinessSchedule)
export class BusinessSchedulesResolver {
  constructor(private readonly service: BusinessSchedulesService) {}

  @Query(() => BusinessSchedule, { name: 'businessScheduleByBusinessId' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => BusinessSchedule, { name: 'updateBusinessSchedule' })
  updateBusinessSchedule(@Args('data') data: UpdateBusinessScheduleInput) {
    return this.service.update(data);
  }
}
