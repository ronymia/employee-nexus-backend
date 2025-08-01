import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ModulesService } from './modules.service';
import {
  Module,
  ModuleQueryResponse,
  ModuleResponse,
} from './entities/module.entity';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { PermissionsGuard } from '../permissions/guards/permission.guard';

@Resolver(() => Module)
export class ModulesResolver {
  constructor(private readonly modulesService: ModulesService) {}

  // CREATE MODULE
  // @Mutation(() => ModuleResponse)
  // async createModule(
  //   @Args('createModuleInput') createModuleInput: CreateModuleInput,
  // ) {
  //   // CREATE MODULE
  //   const result = await this.modulesService.create(createModuleInput);

  //   // SEND RESPONSE
  //   return {
  //     success: true,
  //     statusCode: HttpStatus.CREATED,
  //     message: `Module created successfully`,
  //     data: result,
  //   };
  // }

  // FIND ALL MODULES
  @Query(() => ModuleQueryResponse, { name: 'modules' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Module:read')
  @UseGuards(GqlAuthGuard)
  async findAll() {
    const result = await this.modulesService.findAll();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Modules retrieved successfully`,
      data: result,
    };
  }

  // FIND BY ID MODULE
  @Query(() => ModuleResponse, { name: 'moduleById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Module:read')
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const result = await this.modulesService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Module retrieved successfully`,
      data: result,
    };
  }
}
