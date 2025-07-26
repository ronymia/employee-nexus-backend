import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common/dto/paginated-response.type';
import { ServicePlan } from '../entities/service-plan.entity';

@ObjectType()
export class PaginatedServicePlans extends PaginatedResponse(ServicePlan) {}
