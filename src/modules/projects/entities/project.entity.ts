import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProjectMember } from './project-member.entity';
import { IsOptional } from 'class-validator';
import { Business } from 'src/modules/businesses/entities/business.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

@ObjectType()
export class Project {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  status: string;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate?: Date;

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
