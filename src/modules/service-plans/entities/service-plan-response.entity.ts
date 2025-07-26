import { ObjectType } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { ServicePlan } from './service-plan.entity';

// This creates a concrete GraphQL object type
@ObjectType()
export class ServicePlanResponse extends BaseResponse(ServicePlan) {}

@ObjectType()
export class ServicePlanQueryResponse extends BaseQueryResponse(ServicePlan) {}
