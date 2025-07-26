import { ObjectType } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base-response.type';
import { ServicePlan } from './service-plan.entity';

// This creates a concrete GraphQL object type
@ObjectType()
export class CreateServicePlanResponse extends BaseResponse(ServicePlan) {}
