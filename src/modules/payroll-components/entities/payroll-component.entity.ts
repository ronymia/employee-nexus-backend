import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { ComponentType } from '../enums/component-type.enum';
import { CalculationType } from '../enums/calculation-type.enum';
import {
  BaseResponse,
  BaseQueryResponse,
} from '../../../common/dto/base-response.type';

@ObjectType()
export class PayrollComponent {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  status: string;

  @Field(() => ComponentType)
  componentType: ComponentType;

  @Field(() => CalculationType)
  calculationType: CalculationType;

  @Field(() => Float, { nullable: true })
  defaultValue?: number;

  @Field()
  isTaxable: boolean;

  @Field()
  isStatutory: boolean;

  @Field(() => Int, { nullable: true })
  displayOrder?: number;

  @Field(() => Int, { nullable: true })
  businessId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class PayrollComponentResponse extends BaseResponse(PayrollComponent) {}

@ObjectType()
export class PayrollComponentsQueryResponse extends BaseQueryResponse(
  PayrollComponent,
) {}
