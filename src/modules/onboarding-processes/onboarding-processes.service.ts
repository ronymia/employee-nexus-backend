import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOnboardingProcessInput } from './dto/create-onboarding-process.input';
import { UpdateOnboardingProcessInput } from './dto/update-onboarding-process.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryOnboardingProcessInput } from './dto/query-onboarding-process.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { onboardingProcessSearchableFields } from './onboardingProcess.constant';
import { Status } from 'src/common/enums';

@Injectable()
export class OnboardingProcessesService {
  // PRISMA SERVICE
  constructor(private readonly prisma: PrismaService) {}
  // CONSOLE LOG
  private readonly logger = new ConsoleLogger(OnboardingProcessesService.name);

  async create({
    user,
    createOnboardingProcessInput,
  }: {
    user: JwtPayload;
    createOnboardingProcessInput: CreateOnboardingProcessInput;
  }) {
    return await this.prisma.onboardingProcess.create({
      data: {
        ...createOnboardingProcessInput,
        createdBy: user.userId,
        businessId: user.businessId,
        status: Status.ACTIVE,
      },
    });
  }

  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query: QueryOnboardingProcessInput;
  }) {
    // BUSINESS ID
    const businessId = user.businessId;
    const { pagination, ...filters } = query ?? {};

    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    const { searchTerm, isRequired } = filters;

    // QUERY BUILDER
    const andCondition: any[] = [];
    // Search in Field
    if (searchTerm) {
      andCondition.push({
        OR: onboardingProcessSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    if (isRequired !== undefined) {
      andCondition.push({ isRequired });
    }
    const whereCondition: Prisma.OnboardingProcessWhereInput =
      andCondition.length ? { AND: andCondition } : {};

    const result = !limit
      ? await this.prisma.onboardingProcess.findMany({
          where: {
            businessId,
          },
        })
      : await this.prisma.onboardingProcess.findMany({
          where: {
            ...whereCondition,
            businessId,
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
        });
    // this.logger.log(result);

    // META
    const total = await this.prisma.onboardingProcess.count({
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
        totalPages: Math.ceil(total / limit),
      },
      data: result,
    };
  }

  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const businessId = user.businessId;
    const result = await this.prisma.onboardingProcess.findUnique({
      where: { id, businessId },
    });
    if (!result) {
      throw new NotFoundException(`Onboarding Process with ID ${id} not found`);
    }

    return result;
  }

  async update({
    user,
    id,
    updateOnboardingProcessInput,
  }: {
    user: JwtPayload;
    id: number;
    updateOnboardingProcessInput: UpdateOnboardingProcessInput;
  }) {
    await this.findOne({ user, id }); // Ensure the onboarding process exists
    return await this.prisma.onboardingProcess.update({
      where: { id, businessId: user.businessId },
      data: updateOnboardingProcessInput,
    });
  }
  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // Ensure the onboarding process exists
    return await this.prisma.onboardingProcess.delete({
      where: { id, businessId: user.businessId },
    });
  }
}
