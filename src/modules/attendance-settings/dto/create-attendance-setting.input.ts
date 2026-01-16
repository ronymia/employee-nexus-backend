// CREATE ATTENDANCE SETTING INPUT - DEFINES THE STRUCTURE FOR CREATING NEW ATTENDANCE SETTING RECORDS
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsBoolean, Min, Max } from 'class-validator';

@InputType()
export class CreateAttendanceSettingInput {
  @Field(() => Int, {
    description: 'Punch in time tolerance in minutes',
    defaultValue: 15,
  })
  @IsInt()
  @Min(0)
  @Max(60)
  punchInTimeTolerance: number;

  @Field(() => Int, {
    description: 'Work availability definition percentage',
    defaultValue: 80,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  workAvailabilityDefinition: number;

  @Field(() => Boolean, {
    description: 'Whether punch in/out alerts are enabled',
    defaultValue: true,
  })
  @IsBoolean()
  punchInOutAlert: boolean;

  @Field(() => Int, {
    description: 'Punch in/out interval in hours',
    defaultValue: 1,
  })
  @IsInt()
  @Min(1)
  @Max(24)
  punchInOutInterval: number;

  @Field(() => Boolean, {
    description: 'Whether auto approval is enabled',
    defaultValue: false,
  })
  @IsBoolean()
  autoApproval: boolean;

  @Field(() => Boolean, {
    description: 'Whether geolocation is enabled',
    defaultValue: false,
  })
  @IsBoolean()
  isGeoFencingEnabled: boolean;
}
