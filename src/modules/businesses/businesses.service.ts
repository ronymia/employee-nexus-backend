import {
  Injectable,
  NotAcceptableException,
  NotImplementedException,
} from '@nestjs/common';
import { CreateBusinessInput } from './dto/create-business.input';
import { UpdateBusinessInput } from './dto/update-business.input';
import { CreateUserInput } from '../users/dto/create-user.input';
import { CreateProfileInput } from '../profiles/dto/create-profile.input';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { defaultDesignations } from 'src/Database/designation';
import { defaultEmploymentStatuses } from 'src/Database/employment-status';
import { defaultLeaveTypes } from 'src/Database/leave-type';
import { defaultAttendanceSettings } from 'src/Database/attendance-settings';
import { leaveSettings } from 'src/Database/leave-settings';
import { paymentSettings } from 'src/Database/payment-settings';
import { businessSettings } from 'src/Database/business-settings';
import { ROLE } from 'src/enums';
import {
  adminPermissions,
  employeePermissions,
  managerPermissions,
  ownerPermissions,
} from 'src/config';
import { QueryBusinessInput } from './dto/query-business.input';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { businessSearchableFields } from './businesses.constant';
import { BusinessStatus } from './enums';
import { Status } from 'src/common/enums';
import { UserAccountStatus } from '../users/enums';
import { SubscriptionStatusHelper } from '../business-subscriptions/helpers/subscription-status.helper';
import { BusinessSubscriptionStatus } from '../subscription-plans/enums';
import { defaultWorkSchedule } from 'src/Database/work-schedule';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}
  private getDefaultBusinessSchedules(businessId: number) {
    const daysConfig = [
      { dayOfWeek: 0, isWeekend: false }, // Sunday
      { dayOfWeek: 1, isWeekend: false }, // Monday
      { dayOfWeek: 2, isWeekend: false }, // Tuesday
      { dayOfWeek: 3, isWeekend: false }, // Wednesday
      { dayOfWeek: 4, isWeekend: false }, // Thursday
      { dayOfWeek: 5, isWeekend: true }, // Friday
      { dayOfWeek: 6, isWeekend: true }, // Saturday
    ];

    return daysConfig.map(({ dayOfWeek, isWeekend }) => ({
      dayOfWeek,
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
    const { subscription, ...createBusinessData } = createBusinessInput;

    // START DATABASE TRANSACTION
    const newBusiness = await this.prisma.$transaction(
      async (prismaTransaction: Prisma.TransactionClient) => {
        // STEP 0: VALIDATE SUBSCRIPTION PLAN
        const servicePlan = await prismaTransaction.subscriptionPlan.findFirst({
          where: { id: subscription.subscriptionPlanId },
        });
        if (!servicePlan) {
          throw new NotAcceptableException('Service plan not found');
        }

        // STEP 1: CREATE INITIAL USER (WITH TEMPORARY ROLE)
        const createdUser = await prismaTransaction.user.create({
          data: {
            email: createUserInput.email,
            password: createUserInput.password,
            status: UserAccountStatus.ACTIVE,
            role: { connect: { id: 2 } }, // TEMPORARY ROLE - WILL BE UPDATED AFTER BUSINESS CREATION
          },
        });
        if (!createdUser) {
          throw new NotImplementedException('User creation failed');
        }

        // STEP 2: CREATE USER PROFILE
        const createdProfile = await prismaTransaction.profile.create({
          data: { ...createProfileInput, userId: createdUser.id },
        });
        if (!createdProfile) {
          throw new NotImplementedException('Profile creation failed');
        }

        // STEP 3: CREATE BUSINESS

        const createdBusiness = await prismaTransaction.business.create({
          data: {
            ...createBusinessData,
            ownerId: createdUser.id,
            status: BusinessStatus.ACTIVE,
          },
        });
        if (!createdBusiness) {
          throw new NotImplementedException('Business creation failed');
        }

        const businessId = createdBusiness.id;

        // STEP 4: CREATE BUSINESS SUBSCRIPTION
        // Calculate status and isActive from dates
        const { status, isActive } = SubscriptionStatusHelper.calculateStatus({
          trialEndDate: subscription.trialEndDate,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
        });

        const createdSubscription =
          await prismaTransaction.businessSubscription.create({
            data: {
              ...subscription,
              businessId,
              status,
            },
          });
        if (!createdSubscription) {
          throw new NotImplementedException(
            'Business subscription creation failed',
          );
        }

        // STEP 4: CREATE DEFAULT BUSINESS ROLES
        const roleNames = [ROLE.OWNER, ROLE.MANAGER, ROLE.ADMIN, ROLE.EMPLOYEE];
        await prismaTransaction.role.createMany({
          data: roleNames.map((name) => ({
            name: `${name}`,
            businessId,
          })),
          skipDuplicates: true,
        });

        // STEP 5: FIND OWNER ROLE
        const ownerRole = await prismaTransaction.role.findUnique({
          where: {
            name_businessId: {
              name: `${ROLE.OWNER}`,
              businessId,
            },
          },
        });
        if (!ownerRole) {
          throw new NotImplementedException('Owner role not found');
        }

        // STEP 6: ASSIGN OWNER ROLE AND BUSINESS TO USER
        await prismaTransaction.user.update({
          where: { id: createdUser.id },
          data: {
            roleId: ownerRole.id,
            businessId: createdBusiness.id,
          },
        });

        // STEP 7: SETUP ROLE PERMISSIONS
        const databasePermissions =
          await prismaTransaction.permission.findMany();
        if (!databasePermissions) {
          throw new NotImplementedException('Permissions not found');
        }

        // DEFINE ROLE-PERMISSION MAPPING
        const rolePermissionMap: Record<
          string,
          { resource: string; action: string }[]
        > = {
          [ROLE.OWNER]: ownerPermissions.flatMap((p) =>
            p.action.map((a) => ({ resource: p.resource, action: a })),
          ),
          [ROLE.MANAGER]: managerPermissions.flatMap((p) =>
            p.action.map((a) => ({ resource: p.resource, action: a })),
          ),
          [ROLE.ADMIN]: adminPermissions.flatMap((p) =>
            p.action.map((a) => ({ resource: p.resource, action: a })),
          ),
          [ROLE.EMPLOYEE]: employeePermissions.flatMap((p) =>
            p.action.map((a) => ({ resource: p.resource, action: a })),
          ),
        };

        // ASSIGN PERMISSIONS TO EACH ROLE
        const rolesInBusiness = await prismaTransaction.role.findMany({
          where: { businessId },
        });
        if (!rolesInBusiness) {
          throw new NotImplementedException('Roles not found');
        }

        for (const role of rolesInBusiness) {
          const baseName = role.name.split('#')[0];
          const permissionConfig = rolePermissionMap[baseName];
          if (!permissionConfig) continue;

          const matchedPermissions = databasePermissions.filter((permission) =>
            permissionConfig.some(
              (config) =>
                permission.resource === config.resource &&
                permission.action === config.action,
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

        // STEP 8: CREATE DEFAULT MASTER DATA
        // CREATE DEFAULT DESIGNATIONS
        await Promise.all(
          defaultDesignations.map((element) =>
            prismaTransaction.designation.create({
              data: {
                ...element,
                status: Status.ACTIVE,
                business: { connect: { id: businessId } },
              },
            }),
          ),
        );

        // CREATE DEFAULT EMPLOYMENT STATUSES
        await Promise.all(
          defaultEmploymentStatuses.map((element) =>
            prismaTransaction.employmentStatus.create({
              data: {
                ...element,
                status: Status.ACTIVE,
                business: { connect: { id: businessId } },
              },
            }),
          ),
        );

        // CREATE DEFAULT LEAVE TYPES
        await Promise.all(
          defaultLeaveTypes.map((element) =>
            prismaTransaction.leaveType.create({
              data: {
                ...element,
                status: Status.ACTIVE,
                business: { connect: { id: businessId } },
              },
            }),
          ),
        );

        // STEP 9: CREATE BUSINESS SETTINGS
        // CREATE ATTENDANCE SETTINGS
        await prismaTransaction.attendanceSettings.create({
          data: { ...defaultAttendanceSettings, businessId },
        });

        // CREATE LEAVE SETTINGS
        await prismaTransaction.leaveSettings.create({
          data: { ...leaveSettings, businessId },
        });

        // CREATE PAYMENT SETTINGS
        await prismaTransaction.paymentSettings.create({
          data: { ...paymentSettings, businessId },
        });

        // CREATE BUSINESS SETTINGS
        await prismaTransaction.businessSettings.create({
          data: {
            ...businessSettings,
            businessId: createdBusiness.id,
            identifierPrefix: this.generateBusinessPrefix(createdBusiness.name),
            deleteReadNotifications: 30,
          },
        });

        // STEP 10: CREATE DEFAULT BUSINESS SCHEDULES
        await prismaTransaction.businessSchedule.createMany({
          data: this.getDefaultBusinessSchedules(createdBusiness.id),
        });

        // CREATE DEFAULT WORK SCHEDULE
        const { schedules, ...defaultSchedules } = defaultWorkSchedule;

        const createdWorkSchedule = await prismaTransaction.workSchedule.create(
          {
            data: { ...defaultSchedules, businessId: createdBusiness.id },
          },
        );

        for (const schedule of schedules) {
          const { timeSlots, ...restSchedule } = schedule;
          await prismaTransaction.daySchedule.create({
            data: {
              ...restSchedule,
              workSchedule: {
                connect: { id: createdWorkSchedule.id },
              },
              timeSlots: {
                createMany: {
                  data: timeSlots.map((slot) => ({
                    ...slot,
                  })),
                },
              },
            },
          });
        }

        //
        const createDepartments = await prismaTransaction.department.create({
          data: {
            businessId,
            name: createBusinessData.name,
            status: Status.ACTIVE,
            description: 'Default Department',
            managerId: null,
          },
        });

        //
        const createWorkSites = await prismaTransaction.workSite.create({
          data: {
            businessId,
            name: createBusinessData.name,
            address: createdBusiness.address,
            status: Status.ACTIVE,
            description: 'Head Office',
          },
        });

        //

        await prismaTransaction.systemDefaults.create({
          data: {
            businessId,
            defaultDepartmentId: createDepartments.id,
            defaultWorkSiteId: createWorkSites.id,
            defaultWorkScheduleId: createdWorkSchedule.id,
          },
        });

        // STEP 11: RETURN CREATED BUSINESS WITH RELATIONS
        return await prismaTransaction.business.findUnique({
          where: { id: createdBusiness.id },
          include: {
            subscriptions: {
              where: {
                status: BusinessSubscriptionStatus.ACTIVE,
              },
            },
            businessSchedules: true,
            businessSettings: true,
            attendanceSettings: true,
          },
        });
      },
      {
        maxWait: 1000 * 60 * 3, // 3 MINUTES
        timeout: 1000 * 60 * 10, // 10 MINUTES
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
      ? await this.prisma.business.findMany({
          include: {
            subscriptions: {
              where: {
                status: BusinessSubscriptionStatus.ACTIVE,
              },
            },
            businessSchedules: true,
            businessSettings: true,
          },
        })
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
            subscriptions: {
              where: {
                status: BusinessSubscriptionStatus.ACTIVE,
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
        businessSchedules: true,
        businessSettings: true,
        subscriptions: {
          where: {
            status: BusinessSubscriptionStatus.ACTIVE,
          },
        },
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
    const { id, subscription, ...restData } = updateBusinessInput;
    // CHECK IF BUSINESS EXISTS
    await this.findOne(id);

    // Start a database transaction
    const newBusiness = await this.prisma.$transaction(
      async (prismaTransaction: Prisma.TransactionClient) => {
        // step 1 : check service plan if subscription is being updated
        if (subscription) {
          const servicePlan =
            await prismaTransaction.subscriptionPlan.findFirst({
              where: {
                id: subscription.subscriptionPlanId,
              },
            });
          if (!servicePlan) {
            throw new NotImplementedException('Service plan not found');
          }
        }

        // Step 2: update the business
        const updateBusiness = await prismaTransaction.business.update({
          where: { id },
          data: restData,
          include: {
            businessSchedules: true,
            businessSettings: true,
            subscriptions: {
              where: {
                status: BusinessSubscriptionStatus.ACTIVE,
              },
            },
          },
        });

        // Step 3: update subscription if provided
        if (subscription) {
          // Calculate status and isActive from dates
          const { status } = SubscriptionStatusHelper.calculateStatus({
            trialEndDate: subscription.trialEndDate,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
          });

          await prismaTransaction.businessSubscription.upsert({
            where: {
              businessId_subscriptionPlanId: {
                businessId: id,
                subscriptionPlanId: subscription.subscriptionPlanId,
              },
            },
            update: {
              subscriptionPlanId: subscription.subscriptionPlanId,
              trialEndDate: subscription.trialEndDate,
              startDate: subscription.startDate,
              endDate: subscription.endDate,
              status,
            },
            create: {
              businessId: id,
              subscriptionPlanId: subscription.subscriptionPlanId,
              trialEndDate: subscription.trialEndDate,
              startDate: subscription.startDate,
              endDate: subscription.endDate,
              status: BusinessSubscriptionStatus.ACTIVE,
              numberOfEmployeesAllowed: 0, // Will be updated from service plan
            },
          });
        }

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
