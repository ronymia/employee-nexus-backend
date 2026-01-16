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
    nullable: true,
  })
  attendance?: Attendance;

  @Field(() => Int, {
    description: 'Project ID if working on a project',
  })
  projectId: number;

  @Field(() => Project, {
    description: 'Project associated with this punch',
  })
  project: Project;

  @Field(() => Int, {
    description: 'Work site ID',
  })
  workSiteId: number;

  @Field(() => WorkSite, {
    description: 'Work site associated with this punch',
  })
  workSite: WorkSite;

  @Field(() => Date, { description: 'Clock in timestamp' })
  punchIn: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Clock out timestamp',
  })
  punchOut?: Date;

  @Field(() => Int, {
    description: 'User ID who recorded the punch in (self or manager)',
  })
  punchInBy: number;

  @Field(() => Int, {
    description: 'User ID who recorded the punch out (self or manager)',
  })
  punchOutBy: number;

  @Field(() => Int, {
    description: 'Calculated work minutes for this session',
  })
  workMinutes: number;

  @Field(() => Int, {
    description: 'Calculated break minutes for this session',
  })
  breakMinutes: number;

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

@ObjectType()
export class AttendancePunchResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => Int)
  statusCode: number;

  @Field(() => String)
  message: string;

  @Field(() => AttendancePunch)
  data: AttendancePunch;
}
