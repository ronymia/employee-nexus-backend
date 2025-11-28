// WORK SCHEDULES SERVICE - PROVIDES BUSINESS LOGIC FOR WORK SCHEDULE CRUD OPERATIONS
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateWorkScheduleInput } from './dto/create-work-schedule.input';
import { UpdateWorkScheduleInput } from './dto/update-work-schedule.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { Prisma, ScheduleType } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { QueryWorkScheduleInput } from './dto/query-work-schedule.input';
import { workScheduleSearchableFields } from './work-schedule.constant';

@Injectable()
export class WorkSchedulesService {
  // PRISMA SERVICE INJECTION
  constructor(private readonly prisma: PrismaService) {}

  // VALIDATE SCHEDULE TYPE CONSISTENCY
  private validateScheduleType(
    scheduleType: ScheduleType,
    schedules: CreateWorkScheduleInput['schedules'],
  ): void {
    if (!schedules || schedules.length === 0) {
      throw new BadRequestException('At least one day schedule is required');
    }

    switch (scheduleType) {
      case ScheduleType.REGULAR: {
        // REGULAR: All 7 days must be present with same time slots
        if (schedules.length !== 7) {
          throw new BadRequestException(
            'REGULAR schedule type requires exactly 7 day schedules (one for each day of the week)',
          );
        }

        // Check all days 0-6 are present
        const days = schedules.map((s) => s.day).sort();
        const expectedDays = [0, 1, 2, 3, 4, 5, 6];
        if (JSON.stringify(days) !== JSON.stringify(expectedDays)) {
          throw new BadRequestException(
            'REGULAR schedule must include all days (0-6)',
          );
        }

        // Check each day has exactly one time slot
        for (const schedule of schedules) {
          if (schedule.timeSlots.length !== 1) {
            throw new BadRequestException(
              'REGULAR schedule type requires exactly one time slot per day',
            );
          }
        }

        // Check all time slots are identical
        const firstSlot = schedules[0].timeSlots[0];
        for (const schedule of schedules) {
          const slot = schedule.timeSlots[0];
          if (
            slot.startTime !== firstSlot.startTime ||
            slot.endTime !== firstSlot.endTime
          ) {
            throw new BadRequestException(
              'REGULAR schedule type requires all days to have the same start and end time',
            );
          }
        }
        break;
      }

      case ScheduleType.SCHEDULED: {
        // SCHEDULED: Can have different days, each day has exactly one time slot
        if (schedules.length > 7) {
          throw new BadRequestException(
            'SCHEDULED schedule type cannot have more than 7 day schedules',
          );
        }

        // Check for duplicate days
        const scheduledDays = schedules.map((s) => s.day);
        const uniqueDays = new Set(scheduledDays);
        if (scheduledDays.length !== uniqueDays.size) {
          throw new BadRequestException(
            'SCHEDULED schedule type cannot have duplicate days',
          );
        }

        // Check each day has exactly one time slot
        for (const schedule of schedules) {
          if (schedule.timeSlots.length !== 1) {
            throw new BadRequestException(
              'SCHEDULED schedule type requires exactly one time slot per day',
            );
          }
        }
        break;
      }

      case ScheduleType.FLEXIBLE: {
        // FLEXIBLE: Can have different days, each day can have multiple time slots
        if (schedules.length > 7) {
          throw new BadRequestException(
            'FLEXIBLE schedule type cannot have more than 7 day schedules',
          );
        }

        // Check for duplicate days
        const flexibleDays = schedules.map((s) => s.day);
        const uniqueFlexibleDays = new Set(flexibleDays);
        if (flexibleDays.length !== uniqueFlexibleDays.size) {
          throw new BadRequestException(
            'FLEXIBLE schedule type cannot have duplicate days',
          );
        }

        // Each day can have one or more time slots (already validated by DTO)
        break;
      }
    }
  }

  // CREATE WORK SCHEDULE - CREATES A NEW WORK SCHEDULE RECORD WITH BUSINESS SCOPING
  async create({
    user,
    createWorkScheduleInput,
  }: {
    user: JwtPayload;
    createWorkScheduleInput: CreateWorkScheduleInput;
  }) {
    // Check if work schedule with same name already exists for this business
    const existingSchedule = await this.prisma.workSchedule.findUnique({
      where: {
        name_businessId: {
          name: createWorkScheduleInput.name,
          businessId: user.businessId,
        },
      },
    });

    if (existingSchedule) {
      throw new ConflictException(
        `Work schedule with name "${createWorkScheduleInput.name}" already exists for this business`,
      );
    }

    // Extract schedules from input
    const { schedules, ...workScheduleData } = createWorkScheduleInput;

    // Validate schedule type consistency
    this.validateScheduleType(
      createWorkScheduleInput.scheduleType || ScheduleType.REGULAR,
      schedules,
    );

    return await this.prisma.workSchedule.create({
      data: {
        ...workScheduleData,
        businessId: user.businessId,
        createdBy: user.userId,
        schedules: {
          create: schedules.map((schedule) => ({
            day: schedule.day,
            isWeekend: schedule.isWeekend,
            timeSlots: {
              create: schedule.timeSlots.map((slot) => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
              })),
            },
          })),
        },
      },
      include: {
        business: true,
        creator: true,
        schedules: {
          include: {
            timeSlots: true,
          },
        },
      },
    });
  }

  // FIND ALL WORK SCHEDULES - RETRIEVES WORK SCHEDULES WITH PAGINATION, SEARCH, AND BUSINESS FILTERING
  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query?: QueryWorkScheduleInput;
  }) {
    // BUSINESS ID
    const businessId = user.businessId;
    const { search, status, scheduleType, page, limit, sortBy, sortOrder } =
      query ?? {};

    // PAGINATION
    const {
      page: currentPage,
      skip,
      limit: currentLimit,
      sortBy: currentSortBy,
      sortOrder: currentSortOrder,
    } = paginationHelpers.calculatePagination({
      page,
      limit,
      sortBy,
      sortOrder,
    });

    // FILTER
    const andCondition: any[] = [];

    // Filter by search term
    if (search) {
      andCondition.push({
        OR: workScheduleSearchableFields.map((field) => ({
          [field]: {
            contains: search,
            mode: 'insensitive',
          },
        })),
      });
    }

    // Filter by status
    if (status) {
      andCondition.push({ status });
    }

    // Filter by schedule type
    if (scheduleType) {
      andCondition.push({ scheduleType });
    }

    const whereCondition: Prisma.WorkScheduleWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.workSchedule.findMany({
          where: {
            ...whereCondition,
            businessId,
          },
          include: {
            business: true,
            creator: true,
            schedules: {
              include: {
                timeSlots: true,
              },
            },
          },
          orderBy: {
            [currentSortBy]: currentSortOrder,
          },
        })
      : await this.prisma.workSchedule.findMany({
          where: {
            ...whereCondition,
            businessId,
          },
          skip,
          take: currentLimit,
          include: {
            business: true,
            creator: true,
            schedules: {
              include: {
                timeSlots: true,
              },
            },
          },
          orderBy: {
            [currentSortBy]: currentSortOrder,
          },
        });

    // META
    const total = await this.prisma.workSchedule.count({
      where: {
        ...whereCondition,
        businessId,
      },
    });

    return {
      meta: {
        page: Number(currentPage),
        limit: Number(currentLimit),
        skip: Number(skip),
        total: Number(total),
        totalPages: currentLimit ? Math.ceil(total / currentLimit) : 1,
      },
      data: result,
    };
  }

  // FIND WORK SCHEDULE BY ID - RETRIEVES A SINGLE WORK SCHEDULE WITH BUSINESS VALIDATION
  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const businessId = user.businessId;
    const result = await this.prisma.workSchedule.findUnique({
      where: { id, businessId },
      include: {
        business: true,
        creator: true,
        schedules: {
          include: {
            timeSlots: true,
          },
        },
      },
    });
    if (!result) {
      throw new NotFoundException(`Work Schedule with ID ${id} not found`);
    }

    return result;
  }

  // UPDATE WORK SCHEDULE - MODIFIES AN EXISTING WORK SCHEDULE RECORD
  async update({
    user,
    id,
    updateWorkScheduleInput,
  }: {
    user: JwtPayload;
    id: number;
    updateWorkScheduleInput: UpdateWorkScheduleInput;
  }) {
    const businessId = user.businessId;

    // Check if the work schedule exists and belongs to the user's business
    const existingSchedule = await this.prisma.workSchedule.findUnique({
      where: { id, businessId },
    });

    if (!existingSchedule) {
      throw new NotFoundException(
        `Work Schedule with ID ${id} not found for your business`,
      );
    }

    // Check if updating name and if it conflicts with existing schedule
    if (
      updateWorkScheduleInput.name &&
      updateWorkScheduleInput.name !== existingSchedule.name
    ) {
      const nameConflict = await this.prisma.workSchedule.findUnique({
        where: {
          name_businessId: {
            name: updateWorkScheduleInput.name,
            businessId,
          },
        },
      });

      if (nameConflict) {
        throw new ConflictException(
          `Work schedule with name "${updateWorkScheduleInput.name}" already exists for this business`,
        );
      }
    }

    // Remove id and schedules from update input
    const { id: _id, schedules, ...updateData } = updateWorkScheduleInput;

    // If schedules are provided, validate schedule type consistency
    if (schedules && schedules.length > 0) {
      const scheduleType =
        updateWorkScheduleInput.scheduleType || existingSchedule.scheduleType;
      this.validateScheduleType(scheduleType, schedules);
    }

    // If schedules are provided, we need to delete old ones and create new ones
    if (schedules && schedules.length > 0) {
      return await this.prisma.$transaction(async (tx) => {
        // Delete existing day schedules (cascade will delete time slots)
        await tx.daySchedule.deleteMany({
          where: { workScheduleId: id },
        });

        // Update work schedule with new schedules
        return await tx.workSchedule.update({
          where: { id, businessId },
          data: {
            ...updateData,
            schedules: {
              create: schedules.map((schedule) => ({
                day: schedule.day,
                isWeekend: schedule.isWeekend,
                timeSlots: {
                  create: schedule.timeSlots.map((slot) => ({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                  })),
                },
              })),
            },
          },
          include: {
            business: true,
            creator: true,
            schedules: {
              include: {
                timeSlots: true,
              },
            },
          },
        });
      });
    }

    // If no schedules provided, just update the basic fields
    return await this.prisma.workSchedule.update({
      where: { id, businessId },
      data: updateData,
      include: {
        business: true,
        creator: true,
        schedules: {
          include: {
            timeSlots: true,
          },
        },
      },
    });
  }

  // DELETE WORK SCHEDULE - REMOVES A WORK SCHEDULE RECORD FROM DATABASE
  async remove({ user, id }: { user: JwtPayload; id: number }) {
    const businessId = user.businessId;

    // Check if the work schedule exists and belongs to the user's business
    const existingSchedule = await this.prisma.workSchedule.findUnique({
      where: { id, businessId },
    });

    if (!existingSchedule) {
      throw new NotFoundException(
        `Work Schedule with ID ${id} not found for your business`,
      );
    }

    return await this.prisma.workSchedule.delete({
      where: { id, businessId },
    });
  }
}
