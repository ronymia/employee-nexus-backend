import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Attendance } from './attendance.entity';
import { Project } from 'src/modules/projects/entities/project.entity';
import { WorkSite } from 'src/modules/work-sites/entities/work-site.entity';

@ObjectType()
export class AttendancePunch {
  @Field(() => ID, { description: 'Unique identifier for the punch record' })
  id: number;

  @Field(() => Int, { description: 'Attendance ID' })
  attendanceId: number;

  @Field(() => Attendance, {
    description: 'Attendance associated with this punch',
  })
  attendance: Attendance;

  @Field(() => Int, {
    nullable: true,
    description: 'Project ID if working on a project',
  })
  projectId?: number;

  @Field(() => Project, {
    nullable: true,
    description: 'Project associated with this punch',
  })
  project?: Project;

  @Field(() => Int, {
    nullable: true,
    description: 'Work site ID',
  })
  workSiteId?: number;

  @Field(() => WorkSite, {
    nullable: true,
    description: 'Work site associated with this punch',
  })
  workSite?: WorkSite;

  @Field(() => Date, { description: 'Clock in timestamp' })
  punchIn: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Clock out timestamp',
  })
  punchOut?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Break start timestamp',
  })
  breakStart?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Break end timestamp',
  })
  breakEnd?: Date;

  @Field(() => Float, {
    nullable: true,
    description: 'Calculated work hours for this session',
  })
  workHours?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Calculated break hours for this session',
  })
  breakHours?: number;

  @Field(() => String, {
    nullable: true,
    description: 'Punch in IP address',
  })
  punchInIp?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Punch out IP address',
  })
  punchOutIp?: string;

  @Field(() => Float, {
    nullable: true,
    description: 'Punch in latitude',
  })
  punchInLat?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Punch in longitude',
  })
  punchInLng?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Punch out latitude',
  })
  punchOutLat?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Punch out longitude',
  })
  punchOutLng?: number;

  @Field(() => String, {
    nullable: true,
    description: 'Punch in device information',
  })
  punchInDevice?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Punch out device information',
  })
  punchOutDevice?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Notes for this punch session',
  })
  notes?: string;

  @Field(() => Date, { description: 'Creation timestamp' })
  createdAt: Date;

  @Field(() => Date, { description: 'Last update timestamp' })
  updatedAt: Date;
}
