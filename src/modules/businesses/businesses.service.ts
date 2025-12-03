import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateBusinessInput } from './dto/create-business.input';
import { UpdateBusinessInput } from './dto/update-business.input';
import { CreateUserInput } from '../users/dto/create-user.input';
import { CreateProfileInput } from '../profiles/dto/create-profile.input';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { defaultDesignations } from 'src/Database/designation';
import { defaultEmploymentStatuses } from 'src/Database/employment-status';
import { defaultJobTypes } from 'src/Database/job-type';
import { defaultJobPlatforms } from 'src/Database/job-platform';
import { defaultLeaveTypes } from 'src/Database/leave-type';
import { defaultRecruitmentProcesses } from 'src/Database/recruitment-process';
import { defaultAttendanceSettings } from 'src/Database/attendance-settings';
import { leaveSettings } from 'src/Database/leave-settings';
import { paymentSettings } from 'src/Database/payment-settings';
import { businessSettings } from 'src/Database/business-settings';
import { DeleteReadNotifications, ROLE } from 'src/enums';
import {
  adminPermissions,
  employeePermissions,
  managerPermissions,
  ownerPermissions,
} from 'src/config';
import { defaultOnboardingProcesses } from 'src/Database/onboarding-process';
import { QueryBusinessInput } from './dto/query-business.input';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { businessSearchableFields } from './businesses.constant';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}
  private getDefaultBusinessSchedules(businessId: number) {
    const daysConfig = [
      { day: 0, isWeekend: false }, // Sunday
      { day: 1, isWeekend: false }, // Monday
      { day: 2, isWeekend: false }, // Tuesday
      { day: 3, isWeekend: false }, // Wednesday
      { day: 4, isWeekend: false }, // Thursday
      { day: 5, isWeekend: true }, // Friday
      { day: 6, isWeekend: true }, // Saturday
    ];

    return daysConfig.map(({ day, isWeekend }) => ({
      day,
      isWeekend,
      startTime: '10:00',
      endTime: '18:00',
      businessId,
    }));
  }

  private generateBusinessPrefix(businessName: string): string {
    return businessName
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => word[0].toUpperCase())
      .join('');
  }
  // REGISTER USER WITH BUSINESS
  async createUserWithBusiness(
    createUserInput: CreateUserInput,
    createProfileInput: CreateProfileInput,
    createBusinessInput: CreateBusinessInput,
  ) {
    // Start a database transaction
    const newBusiness = await this.prisma.$transaction(
      async (prismaTransaction: Prisma.TransactionClient) => {
        // step 0 : check service plan
        const servicePlan = await prismaTransaction.subscriptionPlan.findFirst({
          where: {
            id: createBusinessInput.subscriptionPlanId,
          },
        });
        if (!servicePlan)
          throw new NotImplementedException('Service plan not found');

        // Step 1: Create the primary user
        const createdUser = await prismaTransaction.user.create({
          data: createUserInput,
        });
        if (!createdUser)
          throw new NotImplementedException('User creation failed');

        // Step 2: Create the user's profile
        const createdProfile = await prismaTransaction.profile.create({
          data: { ...createProfileInput, userId: createdUser.id },
        });
        if (!createdProfile)
          throw new NotImplementedException('Profile creation failed');

        // Step 3: Create the business
        const createdBusiness = await prismaTransaction.business.create({
          data: { ...createBusinessInput, userId: createdUser.id },
        });
        if (!createdBusiness) {
          throw new NotImplementedException('Business creation failed');
        }

        await prismaTransaction.user.update({
          where: { id: createdUser.id },
          data: {
            businessId: createdBusiness.id,
          },
        });
        // Get business ID and creator ID
        const businessId = createdBusiness.id;
        const creatorId = createdUser?.id;

        // Step 4: Create default roles for the business
        const roleNames = [ROLE.OWNER, ROLE.MANAGER, ROLE.ADMIN, ROLE.EMPLOYEE];
        await prismaTransaction.role.createMany({
          data: roleNames.map((name) => ({
            name: `${name}#${businessId}`,
            businessId,
          })),
          skipDuplicates: true,
        });

        // Step 5: Find the OWNER role to assign to creator
        const ownerRole = await prismaTransaction.role.findUnique({
          where: {
            name_businessId: {
              name: `${ROLE.OWNER}#${businessId}`,
              businessId,
            },
          },
        });
        if (!ownerRole)
          throw new NotImplementedException('Owner role not found');

        // Step 6: Assign OWNER role to the created user
        await prismaTransaction.user.update({
          where: { id: createdUser.id },
          data: {
            role: { connect: { id: ownerRole.id } },
          },
        });

        // Step 7: Assign permissions to each role (excluding SUPER_ADMIN)
        const databasePermissions =
          await prismaTransaction.permission.findMany();

        if (!databasePermissions)
          throw new NotImplementedException('Permissions not found');

        const rolePermissionMap: Record<
          string,
          { resource: string; action: string }[]
        > = {
          [ROLE.OWNER]: ownerPermissions.flatMap((permission) =>
            permission.action.map((action) => ({
              resource: permission.resource,
              action: action,
            })),
          ),
          [ROLE.MANAGER]: managerPermissions.flatMap((permission) =>
            permission.action.map((action) => ({
              resource: permission.resource,
              action: action,
            })),
          ),
          [ROLE.ADMIN]: adminPermissions.flatMap((permission) =>
            permission.action.map((action) => ({
              resource: permission.resource,
              action: action,
            })),
          ),
          [ROLE.EMPLOYEE]: employeePermissions.flatMap((permission) =>
            permission.action.map((action) => ({
              resource: permission.resource,
              action: action,
            })),
          ),
        };

        const rolesInBusiness = await prismaTransaction.role.findMany({
          where: { businessId },
        });

        if (!rolesInBusiness)
          throw new NotImplementedException('Roles not found');

        for (const role of rolesInBusiness) {
          const baseName = role.name.split('#')[0];
          const permissionConfig = rolePermissionMap[baseName];
          if (!permissionConfig) continue;

          const matchedPermissions = databasePermissions.filter((permission) =>
            permissionConfig.some(
              (superAdminPermission) =>
                permission.resource === superAdminPermission.resource &&
                permission.action === superAdminPermission.action,
            ),
          );

          await prismaTransaction.rolePermission.createMany({
            data: matchedPermissions.map((perm) => ({
              roleId: role.id,
              permissionId: perm.id,
            })),
            skipDuplicates: true,
          });
        }

        // CREATE DEFAULT DESIGNATIONS
        await Promise.all(
          defaultDesignations.map((element) =>
            prismaTransaction.designation.create({
              data: {
                ...element,
                business: {
                  connect: {
                    id: businessId,
                  },
                },
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // CREATE DEFAULT EMPLOYMENT STATUS
        await Promise.all(
          defaultEmploymentStatuses.map(async (element) =>
            prismaTransaction.employmentStatus.create({
              data: {
                ...element,
                business: {
                  connect: {
                    id: businessId,
                  },
                },
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // CREATE DEFAULT JOB TYPE
        await Promise.all(
          defaultJobTypes.map(async (element) =>
            prismaTransaction.jobType.create({
              data: {
                ...element,
                business: {
                  connect: {
                    id: businessId,
                  },
                },
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // CREATE DEFAULT JOB PLATFORM
        await Promise.all(
          defaultJobPlatforms.map(async (element) =>
            prismaTransaction.jobPlatform.create({
              data: {
                ...element,
                business: {
                  connect: {
                    id: businessId,
                  },
                },
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // CREATE DEFAULT LEAVE TYPE
        await Promise.all(
          defaultLeaveTypes.map(async (element) =>
            prismaTransaction.leaveType.create({
              data: {
                ...element,
                business: {
                  connect: {
                    id: businessId,
                  },
                },
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // CREATE DEFAULT RECRUITMENT PROCESS
        await Promise.all(
          defaultRecruitmentProcesses.map(async (element) =>
            prismaTransaction.recruitmentProcess.create({
              data: {
                ...element,
                business: {
                  connect: {
                    id: businessId,
                  },
                },
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // CREATE DEFAULT ONBOARDING PROCESS
        await Promise.all(
          defaultOnboardingProcesses.map(async (element) =>
            prismaTransaction.onboardingProcess.create({
              data: {
                ...element,
                business: {
                  connect: {
                    id: businessId,
                  },
                },
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // Step 9: Create settings
        await prismaTransaction.attendanceSettings.create({
          data: {
            ...defaultAttendanceSettings,
            businessId,
          },
        });

        await prismaTransaction.leaveSettings.create({
          data: {
            ...leaveSettings,
            businessId,
          },
        });

        await prismaTransaction.paymentSettings.create({
          data: {
            ...paymentSettings,
            businessId,
          },
        });

        // Step 10: Create business settings
        // CREATE DEFAULT BUSINESS SETTINGS
        await prismaTransaction.businessSettings.create({
          data: {
            ...businessSettings,
            businessId: createdBusiness.id,
            identifierPrefix: this.generateBusinessPrefix(createdBusiness.name),
            deleteReadNotifications: DeleteReadNotifications.THIRTY_DAYS,
          },
        });

        // Create default business schedules
        await prismaTransaction.businessSchedule.createMany({
          data: this.getDefaultBusinessSchedules(createdBusiness.id),
        });

        // Final: Return the created business
        return await prismaTransaction.business.findUnique({
          where: { id: createdBusiness.id },
          include: {
            owner: {
              include: {
                role: true,
                profile: true,
              },
            },
            subscriptionPlan: true,
            businessSchedules: true,
            businessSettings: true,
            attendanceSettings: true,
          },
        });
      },
      {
        maxWait: 1000 * 60 * 3, //  3 minutes
        timeout: 1000 * 60 * 10, // 10 minutes
      },
    );

    return newBusiness;
  }

  // CREATE BUSINESS ONLY
  // create(createBusinessInput: CreateBusinessInput) {
  //   return 'This action adds a new business';
  // }

  // FIND ALL BUSINESSES
  async findAll({ query }: { query: QueryBusinessInput }) {
    // BUSINESS ID
    const { pagination, ...filters } = query ?? {};

    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    const { searchTerm } = filters;

    // QUERY BUILDER
    const andCondition: any[] = [];
    // Search in Field
    if (searchTerm) {
      andCondition.push({
        OR: businessSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    const whereCondition: Prisma.BusinessWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.business.findMany()
      : await this.prisma.business.findMany({
          where: {
            ...whereCondition,
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            owner: {
              include: {
                role: true,
                profile: true,
                ownedBusiness: true,
              },
            },
            businessSchedules: true,
            businessSettings: true,
          },
        });
    // this.logger.log(result);

    // META
    const total = await this.prisma.business.count();

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

  // FIND ONE BUSINESS
  async findOne(id: number) {
    const business = await this.prisma.business.findUniqueOrThrow({
      where: { id },
      include: {
        owner: {
          include: {
            role: true,
            profile: {
              include: {
                emergencyContact: true,
                socialLinks: true,
              },
            },
          },
        },
        businessSchedules: true,
        businessSettings: true,
        subscriptionPlan: true,
      },
    });
    return business;
  }

  // UPDATE BUSINESS
  async update(
    updateBusinessInput: UpdateBusinessInput,
    // userInput: UpdateUserInput,
    // profileInput: UpdateProfileInput,
  ) {
    const { id, ...restData } = updateBusinessInput;
    // CHECK IF BUSINESS EXISTS
    await this.findOne(id);

    // Start a database transaction
    const newBusiness = await this.prisma.$transaction(
      async (prismaTransaction: Prisma.TransactionClient) => {
        // step 1 : check service plan
        const servicePlan = await prismaTransaction.subscriptionPlan.findFirst({
          where: {
            id: restData.subscriptionPlanId,
          },
        });
        if (!servicePlan) {
          throw new NotImplementedException('Service plan not found');
        }

        // Step 2: update the business
        const updateBusiness = await prismaTransaction.business.update({
          where: { id },
          data: restData,
          include: {
            owner: {
              include: {
                role: true,
                profile: true,
              },
            },
            businessSchedules: true,
            businessSettings: true,
            subscriptionPlan: true,
          },
        });

        return updateBusiness;
      },
      {
        maxWait: 1000 * 60 * 3, //  3 minutes
        timeout: 1000 * 60 * 10, // 10 minutes
      },
    );

    return newBusiness;
  }

  // DELETE BUSINESS
  remove(id: number) {
    return this.prisma.business.delete({
      where: { id },
    });
  }
}
