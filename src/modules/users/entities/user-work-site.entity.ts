import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { WorkSite } from 'src/modules/work-sites/entities/work-site.entity';
import { Employee } from './employee.entity';

@ObjectType()
export class UserWorkSite {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Employee, { nullable: true })
  employee?: Employee;

  @Field(() => Int)
  workSiteId: number;

  @Field(() => WorkSite, { nullable: true })
  workSite?: WorkSite;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class UserWorkSiteResponse {
  @Field()
  statusCode: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => UserWorkSite, { nullable: true })
  data?: UserWorkSite;
}

@ObjectType()
export class UserWorkSitesResponse {
  @Field()
  statusCode: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => [UserWorkSite], { nullable: true })
  data?: UserWorkSite[];
}
