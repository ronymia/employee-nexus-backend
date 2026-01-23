import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHolidayInput } from './dto/create-holiday.input';
import { UpdateHolidayInput } from './dto/update-holiday.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryHolidayInput } from './dto/query-holiday.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { holidaySearchableFields } from './holiday.constant';
import { NotificationsService } from '../notifications/notifications.service';
import dayjs from 'dayjs';

@Injectable()
export class HolidaysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // HOLIDAY OVERVIEW
  async getHolidayOverview({ user }: { user: JwtPayload }) {
    const businessId = user.businessId;

    // Execute all queries in parallel for single round trip
    const [total, typeGroups, recurringCount, paidCount, unpaidCount] =
      await Promise.all([
        this.prisma.holiday.count({ where: { businessId } }),
        this.prisma.holiday.groupBy({
          by: ['holidayType'],
          where: { businessId },
          _count: { holidayType: true },
        }),
        this.prisma.holiday.count({
          where: { businessId, isRecurring: true },
        }),
        this.prisma.holiday.count({ where: { businessId, isPaid: true } }),
        this.prisma.holiday.count({ where: { businessId, isPaid: false } }),
      ]);

    const overview = {
      total,
      public: 0,
      religious: 0,
      companySpecific: 0,
      regional: 0,
      recurring: recurringCount,
      paid: paidCount,
      unpaid: unpaidCount,
    };

    typeGroups.forEach((item) => {
      // Map holiday type to camelCase property names
      const typeMap = {
        PUBLIC: 'public',
        RELIGIOUS: 'religious',
        COMPANY_SPECIFIC: 'companySpecific',
        REGIONAL: 'regional',
      };
      const key = typeMap[item.holidayType];
      if (key) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        overview[key] = item._count.holidayType;
      }
    });

    return overview;
  }

  async create({
    user,
    createHolidayInput,
  }: {
    user: JwtPayload;
    createHolidayInput: CreateHolidayInput;
  }) {
    const holiday = await this.prisma.holiday.create({
      data: {
        ...createHolidayInput,
        startDate: createHolidayInput.startDate,
        endDate: createHolidayInput.endDate,
        businessId: user.businessId,
      },
    });

    // Send notification to all users in the business
    try {
      const businessUsers = await this.prisma.user.findMany({
        where: { businessId: user.businessId },
        select: { id: true },
      });

      const startDate = dayjs(holiday.startDate).format('MMMM D, YYYY');
      const endDate = dayjs(holiday.endDate).format('MMMM D, YYYY');
      const dateDisplay =
        startDate === endDate ? startDate : `${startDate} to ${endDate}`;

      // Send notification to each user
      for (const businessUser of businessUsers) {
        await this.notificationsService.sendFromTemplate(
          'holiday_announced',
          businessUser.id,
          {
            date: dateDisplay,
            holidayName: holiday.name,
            description: holiday.description || '',
            entityType: 'holiday',
            entityId: holiday.id,
          },
          user.businessId,
        );
      }
    } catch (error) {
      console.error('Failed to send holiday notifications:', error);
    }

    return holiday;
  }

  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query: QueryHolidayInput;
  }) {
    const businessId = user.businessId;
    const { pagination, ...filters } = query ?? {};

    // PAGINATION
    const {
      page,
      skip,
      limit,
      sortBy = 'startDate',
      sortOrder = 'desc',
    } = paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    const { searchTerm, holidayType, isRecurring, isPaid, startDate, endDate } =
      filters;

    // QUERY BUILDER
    const andCondition: any[] = [];

    // Search in fields
    if (searchTerm) {
      andCondition.push({
        OR: holidaySearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }

    // Filter by holiday type
    if (holidayType) {
      andCondition.push({ holidayType });
    }

    // Filter by isRecurring
    if (isRecurring !== undefined) {
      andCondition.push({ isRecurring });
    }

    // Filter by isPaid
    if (isPaid !== undefined) {
      andCondition.push({ isPaid });
    }

    // Filter by date range
    if (startDate) {
      andCondition.push({
        startDate: {
          gte: new Date(startDate),
        },
      });
    }

    if (endDate) {
      andCondition.push({
        endDate: {
          lte: new Date(endDate),
        },
      });
    }

    const whereCondition: Prisma.HolidayWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.holiday.findMany({
          where: {
            businessId,
          },
          orderBy: {
            startDate: 'desc',
          },
          include: {
            business: true,
          },
        })
      : await this.prisma.holiday.findMany({
          where: {
            ...whereCondition,
            businessId,
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            business: true,
          },
        });

    // META
    const total = await this.prisma.holiday.count({
      where: {
        businessId,
      },
    });

    return {
      meta: {
        page: Number(page),
        limit: Number(limit),
        skip: Number(skip),
        total: Number(total),
        totalPages: limit ? Math.ceil(total / limit) : 1,
      },
      data: result,
    };
  }

  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const businessId = user.businessId;
    const result = await this.prisma.holiday.findUnique({
      where: { id, businessId },
    });
    if (!result) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }

    return result;
  }

  async update({
    user,
    updateHolidayInput,
  }: {
    user: JwtPayload;
    updateHolidayInput: UpdateHolidayInput;
  }) {
    const { id, ...updateData } = updateHolidayInput;

    await this.findOne({ user, id }); // Ensure the holiday exists

    return await this.prisma.holiday.update({
      where: { id, businessId: user.businessId },
      data: updateData,
    });
  }

  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // Ensure the holiday exists
    return await this.prisma.holiday.delete({
      where: { id, businessId: user.businessId },
    });
  }
}
