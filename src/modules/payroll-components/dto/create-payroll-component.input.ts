import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ComponentType } from '../enums/component-type.enum';
import { CalculationType } from '../enums/calculation-type.enum';

@InputType()
export class CreatePayrollComponentInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  code: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => ComponentType)
  @IsEnum(ComponentType)
  componentType: ComponentType;

  @Field(() => CalculationType)
  @IsEnum(CalculationType)
  calculationType: CalculationType;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  defaultValue?: number;

  @Field({ defaultValue: true })
  @IsBoolean()
  @IsOptional()
  isTaxable?: boolean;

  @Field({ defaultValue: false })
  @IsBoolean()
  @IsOptional()
  isStatutory?: boolean;
}
