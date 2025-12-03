import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HolidaysService } from './holidays.service';
import {
  Holiday,
  HolidayResponse,
  HolidaysQueryResponse,
} from './entities/holiday.entity';
import { CreateHolidayInput } from './dto/create-holiday.input';
import { UpdateHolidayInput } from './dto/update-holiday.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QueryHolidayInput } from './dto/query-holiday.input';

@Resolver(() => Holiday)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class HolidaysResolver {
  constructor(private readonly holidaysService: HolidaysService) {}

  // CREATE HOLIDAY
  @Mutation(() => HolidayResponse, { name: 'createHoliday' })
  @RequirePermissions('Holiday:create')
  async createHoliday(
    @Args('createHolidayInput') createHolidayInput: CreateHolidayInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.holidaysService.create({
      user,
      createHolidayInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Holiday created successfully`,
      data: result,
    };
  }

  // FIND ALL HOLIDAYS
  @Query(() => HolidaysQueryResponse, { name: 'holidays' })
  @RequirePermissions('Holiday:read')
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryHolidayInput,
  ) {
    const result = await this.holidaysService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Holidays retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE HOLIDAY
  @Query(() => HolidayResponse, { name: 'holidayById' })
  @RequirePermissions('Holiday:read')
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.holidaysService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Holiday retrieved successfully`,
      data: result,
    };
  }

  // UPDATE HOLIDAY
  @Mutation(() => HolidayResponse, { name: 'updateHoliday' })
  @RequirePermissions('Holiday:update')
  async updateHoliday(
    @CurrentUser() user: JwtPayload,
    @Args('updateHolidayInput') updateHolidayInput: UpdateHolidayInput,
  ) {
    const result = await this.holidaysService.update({
      user,
      updateHolidayInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Holiday updated successfully`,
      data: result,
    };
  }

  // REMOVE HOLIDAY
  @Mutation(() => HolidayResponse, { name: 'deleteHoliday' })
  @RequirePermissions('Holiday:delete')
  async removeHoliday(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.holidaysService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Holiday deleted successfully`,
      data: result,
    };
  }
}
