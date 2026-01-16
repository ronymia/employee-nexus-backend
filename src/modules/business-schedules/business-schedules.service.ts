import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBusinessScheduleInput } from './dto/update-business-schedule.input';
import { JwtPayload } from '../auth/jwt.strategy';

/** Convert "HH:MM:SS" to Date at epoch in UTC (works with @db.Time(0)) */
// function timeToDate(hms: string): Date {
//   const [h, m, s] = hms.split(':').map(Number);
//   return new Date(Date.UTC(1970, 0, 1, h, m, s || 0));
// }

// /** Format Date (time part) to "HH:MM:SS" */
// function dateToHMS(d: Date): string {
//   const hh = String(d.getUTCHours()).padStart(2, '0');
//   const mm = String(d.getUTCMinutes()).padStart(2, '0');
//   const ss = String(d.getUTCSeconds()).padStart(2, '0');
//   return `${hh}:${mm}:${ss}`;
// }

/** Validate end > start and (optionally) businessId/day bounds. */
// function assertRange(start: string, end: string) {
//   if (timeToDate(end) <= timeToDate(start)) {
//     throw new BadRequestException('endTime must be greater than startTime');
//   }
// }

@Injectable()
export class BusinessSchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  // GET BUSINESS SCHEDULE BY ID
  async findOne(id: number) {
    const row = await this.prisma.businessSchedule.findUnique({
      where: { id },
    });
    if (!row) {
      throw new NotFoundException('BusinessSchedule not found');
    }
    return row;
  }

  // GET ALL BUSINESS SCHEDULES BY BUSINESS ID
  async findByBusinessId(businessId: number) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business not Found with ${businessId}`);
    }

    return this.prisma.businessSchedule.findMany({
      where: { businessId },
    });
  }

  // UPDATE BUSINESS SCHEDULE
  async update({
    businessId,
    updateBusinessScheduleInput,
  }: {
    businessId: number;
    updateBusinessScheduleInput: UpdateBusinessScheduleInput;
  }) {
    // Fetch current to compare / fill defaults
    // const current = await this.prisma.businessSchedule.findFirst({
    //   where: { businessId: user.businessId },
    // });
    // if (!current) throw new NotFoundException('BusinessSchedule not found');

    // const startHMS = data.startTime ?? dateToHMS(current.startTime);
    // const endHMS = data.endTime ?? dateToHMS(current.endTime);
    // assertRange(startHMS, endHMS);

    const updated = await this.prisma.businessSchedule.upsert({
      where: { id: updateBusinessScheduleInput.id },
      create: {
        dayOfWeek: updateBusinessScheduleInput.dayOfWeek || 0,
        isWeekend: updateBusinessScheduleInput.isWeekend || false,
        startTime: updateBusinessScheduleInput.startTime || '09:00:00',
        endTime: updateBusinessScheduleInput.endTime || '17:00:00',
        businessId: businessId,
      },
      update: {
        dayOfWeek: updateBusinessScheduleInput.dayOfWeek ?? 0,
        isWeekend: updateBusinessScheduleInput.isWeekend ?? false,
        startTime: updateBusinessScheduleInput.startTime,
        endTime: updateBusinessScheduleInput.endTime,
        businessId: businessId,
      },
    });
    return updated;
  }
}
