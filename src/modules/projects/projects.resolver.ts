import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import {
  Project,
  ProjectResponse,
  ProjectsQueryResponse,
  ProjectMemberResponse,
} from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { AssignProjectMemberInput } from './dto/assign-project-member.input';
import { UnassignProjectMemberInput } from './dto/unassign-project-member.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation(() => ProjectResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Project:create')
  @UseGuards(GqlAuthGuard)
  async createProject(
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.projectsService.create({
      user,
      createProjectInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Project created successfully',
      data: result,
    };
  }

  @Query(() => ProjectsQueryResponse, { name: 'projects' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Project:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('businessId', { type: () => Int, nullable: true })
    businessId?: number,
  ) {
    const result = await this.projectsService.findAll({
      user,
      businessId,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Projects retrieved successfully',
      data: result,
      meta: {
        total: result.length,
        page: 1,
        limit: result.length,
        totalPages: 1,
      },
    };
  }

  @Query(() => ProjectResponse, { name: 'project' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Project:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.projectsService.findOne({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project retrieved successfully',
      data: result,
    };
  }

  @Mutation(() => ProjectResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Project:update')
  @UseGuards(GqlAuthGuard)
  async updateProject(
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.projectsService.update({
      user,
      id: updateProjectInput.id,
      updateProjectInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project updated successfully',
      data: result,
    };
  }

  @Mutation(() => ProjectResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Project:delete')
  @UseGuards(GqlAuthGuard)
  async removeProject(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.projectsService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project deleted successfully',
      data: result,
    };
  }

  @Mutation(() => ProjectMemberResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Project Member:create')
  @UseGuards(GqlAuthGuard)
  async assignProjectMember(
    @Args('assignProjectMemberInput')
    assignProjectMemberInput: AssignProjectMemberInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.projectsService.assignMember({
      assignProjectMemberInput,
      user,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project member assigned successfully',
      data: result,
    };
  }

  @Mutation(() => ProjectMemberResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Project Member:delete')
  @UseGuards(GqlAuthGuard)
  async unassignProjectMember(
    @Args('unassignProjectMemberInput')
    unassignProjectMemberInput: UnassignProjectMemberInput,
  ) {
    const result = await this.projectsService.unassignMember({
      unassignProjectMemberInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Project member unassigned successfully',
      data: result,
    };
  }
}
