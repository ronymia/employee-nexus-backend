import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ComponentType } from '../enums/component-type.enum';

@InputType()
export class QueryPayrollComponentInput {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  businessId?: number;

  @Field(() => ComponentType, { nullable: true })
  @IsEnum(ComponentType)
  @IsOptional()
  componentType?: ComponentType;
}
