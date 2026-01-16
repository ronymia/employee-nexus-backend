import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { SalaryType } from '../entities/employee-salary.entity';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

@InputType()
export class QueryEmployeeSalaryInput {
  @Field(() => Int, {
    nullable: true,
    description: 'Filter by user ID',
  })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @Field(() => SalaryType, {
    nullable: true,
    description: 'Filter by salary type',
  })
  @IsOptional()
  @IsEnum(SalaryType)
  salaryType?: SalaryType;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter by active status',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field(() => BasePaginationInput, { nullable: true })
  @IsOptional()
  pagination?: BasePaginationInput | null;
}
