import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Project } from './project.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { Employee } from 'src/modules/users/entities/employee.entity';

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

  @Field(() => Employee)
  employee: Employee;

  @Field({ nullable: true })
  role?: string;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  remarks?: string;

  @Field({ nullable: true })
  notes?: string;

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
