import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { SystemModulesService } from './system-modules.service';
import {
  SystemModule,
  SystemModuleQueryResponse,
  SystemModuleResponse,
} from './entities/system-module.entity';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';

@Resolver(() => SystemModule)
export class SystemModulesResolver {
  constructor(private readonly systemModulesService: SystemModulesService) {}

  // FIND ALL MODULES
  @Query(() => SystemModuleQueryResponse, { name: 'modules' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Module:read')
  @UseGuards(GqlAuthGuard)
  async findAll() {
    const result = await this.systemModulesService.findAll();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `System modules retrieved successfully`,
      data: result,
    };
  }

  // FIND BY ID MODULE
  @Query(() => SystemModuleResponse, { name: 'moduleById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Module:read')
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const result = await this.systemModulesService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `System module retrieved successfully`,
      data: result,
    };
  }
}
