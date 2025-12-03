import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Business } from '../../businesses/entities/business.entity';
import { User } from '../../users/entities/user.entity';
import { ProjectMember } from './project-member.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from '../../../common/dto/base-response.type';
import { IsOptional } from 'class-validator';

@ObjectType()
export class Project {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  cover: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  startDate?: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field(() => Int, { nullable: true })
  businessId?: number;

  @Field(() => Business, { nullable: true })
  business?: Business;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field(() => User, { nullable: true })
  creator?: User;

  @Field(() => [ProjectMember], { nullable: true, defaultValue: [] })
  @IsOptional()
  projectMembers?: ProjectMember[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ProjectResponse extends BaseResponse(Project) {}

@ObjectType()
export class ProjectsQueryResponse extends BaseQueryResponse(Project) {}

@ObjectType()
export class ProjectMemberResponse extends BaseResponse(ProjectMember) {}

@ObjectType()
export class ProjectMembersQueryResponse extends BaseQueryResponse(
  ProjectMember,
) {}
