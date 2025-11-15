// QUERY ATTENDANCE SETTING INPUT - DEFINES FILTERING AND PAGINATION OPTIONS FOR ATTENDANCE SETTING QUERIES
import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

@InputType()
export class QueryAttendanceSettingInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  punchInOutAlert?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  autoApproval?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isGeoLocationEnabled?: boolean;
}
