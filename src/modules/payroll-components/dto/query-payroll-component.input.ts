import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ComponentType } from '../enums/component-type.enum';
import { PayrollComponentStatus } from 'generated/prisma';
import { CalculationType } from '../enums';

registerEnumType(PayrollComponentStatus, {
  name: 'PayrollComponentStatus',
  description: 'Status of the payroll component',
});

@InputType()
export class QueryPayrollComponentInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @Field(() => ComponentType, { nullable: true })
  @IsEnum(ComponentType)
  @IsOptional()
  componentType?: ComponentType;

  @Field(() => CalculationType, { nullable: true })
  @IsEnum(CalculationType)
  @IsOptional()
  calculationType?: CalculationType;

  @Field(() => PayrollComponentStatus, { nullable: true })
  @IsEnum(PayrollComponentStatus)
  @IsOptional()
  status?: PayrollComponentStatus;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isTaxable?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isStatutory?: boolean;
}
