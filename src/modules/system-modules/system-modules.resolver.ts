/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SystemModulesService } from './system-modules.service';
import { SystemModule } from './entities/system-module.entity';
import { CreateSystemModuleInput } from './dto/create-system-module.input';
import { UpdateSystemModuleInput } from './dto/update-system-module.input';
import {
  SystemModuleQueryResponse,
  SystemModuleResponse,
} from './entities/system-module-response.entity';
import { HttpStatus } from '@nestjs/common';

@Resolver(() => SystemModule)
export class SystemModulesResolver {
  constructor(private readonly systemModulesService: SystemModulesService) {}

  @Mutation(() => SystemModuleResponse)
  async createSystemModule(
    @Args('createSystemModuleInput')
    createSystemModuleInput: CreateSystemModuleInput,
  ): Promise<SystemModuleResponse> {
    // CREATE SYSTEM MODULE
    const result = await this.systemModulesService.create(
      createSystemModuleInput,
    );

    // SEND RESPONSE
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: `System module created successfully`,
      data: result,
    };
  }

  // FIND ALL SYSTEM MODULES
  @Query(() => SystemModuleQueryResponse, { name: 'systemModules' })
  async findAll(): Promise<SystemModuleQueryResponse> {
    const result = await this.systemModulesService.findAll();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `System modules retrieved successfully`,
      data: result,
    };
  }

  // FIND BY ID SYSTEM MODULE
  @Query(() => SystemModuleResponse, { name: 'systemModuleById' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<SystemModuleResponse> {
    const result = await this.systemModulesService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `System module retrieved successfully`,
      data: result,
    };
  }

  // UPDATE SYSTEM MODULE
  @Mutation(() => SystemModuleResponse)
  async updateSystemModule(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateSystemModuleInput')
    updateSystemModuleInput: UpdateSystemModuleInput,
  ): Promise<SystemModuleResponse> {
    // UPDATE SYSTEM MODULE
    const result = await this.systemModulesService.update(
      id,
      updateSystemModuleInput,
    );

    // SEND RESPONSE
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `System module updated successfully`,
      data: result,
    };
  }

  // REMOVE SYSTEM MODULE
  @Mutation(() => SystemModuleResponse)
  async removeSystemModule(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<SystemModuleResponse> {
    // REMOVE SYSTEM MODULE
    const result = await this.systemModulesService.remove(id);

    // SEND RESPONSE
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `System module removed successfully`,
      data: result,
    };
  }
}
