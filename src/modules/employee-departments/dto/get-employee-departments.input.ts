import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class GetEmployeeDepartmentsInput {
  @Field(() => Int, { nullable: true, description: 'Filter by user ID' })
  @IsInt()
  @IsOptional()
  userId?: number;

  @Field(() => Int, { nullable: true, description: 'Filter by department ID' })
  @IsInt()
  @IsOptional()
  departmentId?: number;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter by primary status',
  })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter by active status',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
