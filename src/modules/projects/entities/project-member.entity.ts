import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Project } from './project.entity';
import { User } from '../../users/entities/user.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

@ObjectType()
export class ProjectMember {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  projectId: number;

  @Field(() => Project)
  project: Project;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

  @Field({ nullable: true })
  role?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ProjectMemberResponse extends BaseResponse(ProjectMember) {}

@ObjectType()
export class ProjectMembersQueryResponse extends BaseQueryResponse(
  ProjectMember,
) {}
