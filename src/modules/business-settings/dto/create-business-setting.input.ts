import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsString,
  IsInt,
  IsBoolean,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateBusinessSettingInput {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  businessId: number;

  @Field(() => String, {
    description: 'Prefix for business identifiers',
  })
  @IsString()
  identifierPrefix: string;

  @Field(() => Int, {
    description: 'Business start day of the week (0-6, where 0=Sunday)',
    defaultValue: 0,
  })
  @IsInt()
  @Min(0)
  @Max(6)
  businessStartDay: number;

  @Field(() => String, {
    description: 'Business currency code',
    defaultValue: 'BDT',
  })
  @IsString()
  currency: string;

  // @Field(() => Boolean, {
  //   description: 'Whether self-registration is enabled',
  //   defaultValue: false,
  // })
  // @IsBoolean()
  // isSelfRegistered: boolean;

  @Field(() => String, {
    description: 'Business time zone',
    nullable: true,
    defaultValue: 'Asia/Dhaka',
  })
  @IsOptional()
  @IsString()
  businessTimeZone?: string;

  @Field(() => String, {
    description: 'Delete read notifications setting',
  })
  @IsString()
  deleteReadNotifications: string;

  @Field(() => String, {
    description: 'Business theme',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  theme?: string;
}
