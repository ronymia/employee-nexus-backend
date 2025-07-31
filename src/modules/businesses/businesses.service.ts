import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateBusinessInput } from './dto/create-business.input';
import { UpdateBusinessInput } from './dto/update-business.input';
import { CreateUserInput } from '../users/dto/create-user.input';
import { CreateProfileInput } from '../profiles/dto/create-profile.input';
import { PrismaService } from '../prisma/prisma.service';
import { DeleteReadNotifications, Prisma } from 'generated/prisma';
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
import { ROLE } from 'src/enums';
import {
  adminPermissions,
  employeePermissions,
  managerPermissions,
  ownerPermissions,
} from 'src/config';
import { defaultOnboardingProcesses } from 'src/Database/onboarding-process';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserWithBusiness(
    createUserInput: CreateUserInput,
    createProfileInput: CreateProfileInput,
    createBusinessInput: CreateBusinessInput,
  ) {
    // Start a database transaction
    const newBusiness = await this.prisma.$transaction(
      async (prismaTransaction: Prisma.TransactionClient) => {
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
        if (!createdBusiness)
          throw new NotImplementedException('Business creation failed');

        const businessId = createdBusiness.id;

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
        const allPermissions = await prismaTransaction.permission.findMany();

        const rolePermissionMap: Record<string, typeof ownerPermissions> = {
          [ROLE.OWNER]: ownerPermissions,
          [ROLE.MANAGER]: managerPermissions,
          [ROLE.ADMIN]: adminPermissions,
          [ROLE.EMPLOYEE]: employeePermissions,
        };

        const rolesInBusiness = await prismaTransaction.role.findMany({
          where: { businessId },
        });

        for (const role of rolesInBusiness) {
          const baseName = role.name.split('#')[0];
          const permissionConfig = rolePermissionMap[baseName];
          if (!permissionConfig) continue;

          const matchedPermissions = allPermissions.filter((perm) =>
            permissionConfig.some(
              (p) =>
                p.resource === perm.resource && p.action.includes(perm.action),
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

        const creatorId = createdUser?.id;
        // CREATE DEFAULT DESIGNATIONS
        await Promise.all(
          defaultDesignations.map((element) =>
            prismaTransaction.designation.create({
              data: {
                ...element,
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
        const identifierPrefix = createdBusiness.name
          .split(' ')
          .map((word) => word[0])
          .join('')
          .toUpperCase();

        await prismaTransaction.businessSettings.create({
          data: {
            ...businessSettings,
            businessId,
            identifierPrefix,
            businessStartDay: 0,
            isSelfRegistered: false,
            deleteReadNotifications: DeleteReadNotifications.THIRTY_DAYS,
          },
        });

        // Final: Return the created business
        return await prismaTransaction.business.findUnique({
          where: { id: createdBusiness.id },
        });
      },
    );

    return newBusiness;
  }
  create(createBusinessInput: CreateBusinessInput) {
    return 'This action adds a new business';
  }

  findAll() {
    return `This action returns all businesses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} business`;
  }

  update(id: number, updateBusinessInput: UpdateBusinessInput) {
    return `This action updates a #${id} business`;
  }

  remove(id: number) {
    return `This action removes a #${id} business`;
  }
}
