// CREATE DEPARTMENT INPUT - DEFINES THE STRUCTURE FOR CREATING NEW DEPARTMENT RECORDS
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsInt, IsOptional } from 'class-validator';

@InputType()
export class CreateDepartmentInput {
  @Field(() => String, { description: 'Name of the department' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the department' })
  @IsString()
  description: string;

  @Field(() => Int, {
    description: 'ID of the parent department',
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  parentId?: number;

  @Field(() => Int, {
    description: 'ID of the manager',
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  managerId?: number;
}
