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
import { businessOwnerPermissions } from 'src/config';
import { defaultOnboardingProcesses } from 'src/Database/onboarding-process';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserWithBusiness(
    createUserInput: CreateUserInput,
    createProfileInput: CreateProfileInput,
    createBusinessInput: CreateBusinessInput,
  ) {
    const newBusiness = await this.prisma.$transaction(
      async (prismaClient: Prisma.TransactionClient) => {
        // CREATE USER
        const createdUser = await prismaClient.user.create({
          data: createUserInput,
        });

        if (!createdUser) {
          throw new NotImplementedException('No User Created');
        }

        //  CREATE PROFILE
        const createdProfile = await prismaClient.profile.create({
          data: { ...createProfileInput, userId: createdUser.id },
        });

        if (!createdProfile) {
          throw new NotImplementedException('No Profile Created');
        }

        // CREATE BUSINESS
        const createBusiness = await prismaClient.business.create({
          data: { ...createBusinessInput, userId: createdUser.id },
        });

        if (!createBusiness) {
          throw new NotImplementedException('No Business Created');
        }

        const businessId = createBusiness.id;

        // CREATE DEFAULT ROLE
        const createdRoles = await prismaClient.role.createMany({
          data: [
            { name: `${ROLE.OWNER}#${businessId}`, businessId },
            { name: `${ROLE.MANAGER}#${businessId}`, businessId },
            { name: `${ROLE.ADMIN}#${businessId}`, businessId },
            { name: `${ROLE.EMPLOYEE}#${businessId}`, businessId },
          ],
          skipDuplicates: true,
        });

        if (!createdRoles) {
          throw new NotImplementedException('No Roles Created');
        }

        // GET OWNER ROLE
        const ownerRole = await prismaClient.role.findUnique({
          where: {
            name_businessId: {
              name: `${ROLE.OWNER}#${businessId}`,
              businessId,
            },
          },
        });

        const ownerRoleId = ownerRole?.id;
        if (!ownerRoleId) {
          throw new NotImplementedException('No Business Owner Role Found');
        }

        // UPDATE USER ROLE
        await prismaClient.user.update({
          where: { id: createdUser.id },
          data: {
            role: {
              connect: {
                id: ownerRoleId,
              },
            },
          },
        });

        // GET ALL BUSINESS OWNER PERMISSIONS
        const formattedOwnerPermissions = businessOwnerPermissions.flatMap(
          (permission) =>
            permission.action.map((action) => ({
              resource: permission.resource,
              action: action,
            })),
        );

        const allPermissions = await prismaClient.permission.findMany();

        // CREATE OWNER PERMISSION
        // Match owner permissions (with ID)
        const matchedOwnerPermissions = allPermissions.filter((permission) =>
          formattedOwnerPermissions.some(
            (ownerPermission) =>
              permission.resource === ownerPermission.resource &&
              permission.action === ownerPermission.action,
          ),
        );

        // Create role-permission links
        await prismaClient.rolePermission.createMany({
          data: matchedOwnerPermissions.map((permission) => ({
            roleId: ownerRoleId,
            permissionId: permission?.id,
          })),
          skipDuplicates: true,
        });

        // CREATE DEFAULT DESIGNATIONS
        await Promise.all(
          defaultDesignations.map((element) =>
            prismaClient.designation.create({
              data: {
                ...element,
                business: { connect: { id: businessId } },
                creator: { connect: { id: createdUser.id } },
              },
            }),
          ),
        );

        // CREATE DEFAULT EMPLOYMENT STATUS
        await Promise.all(
          defaultEmploymentStatuses.map((element) =>
            prismaClient.employmentStatus.create({
              data: {
                ...element,
                business: { connect: { id: businessId } },
                creator: { connect: { id: createdUser.id } },
              },
            }),
          ),
        );

        // CREATE DEFAULT JOB TYPE
        await Promise.all(
          defaultJobTypes.map((element) =>
            prismaClient.jobType.create({
              data: {
                ...element,
                business: { connect: { id: businessId } },
                creator: { connect: { id: createdUser.id } },
              },
            }),
          ),
        );

        // CREATE DEFAULT JOB PLATFORM
        await Promise.all(
          defaultJobPlatforms.map((element) =>
            prismaClient.jobPlatform.create({
              data: {
                ...element,
                business: { connect: { id: businessId } },
                creator: { connect: { id: createdUser.id } },
              },
            }),
          ),
        );

        // CREATE DEFAULT LEAVE TYPE
        await Promise.all(
          defaultLeaveTypes.map((element) =>
            prismaClient.leaveType.create({
              data: {
                ...element,
                business: { connect: { id: businessId } },
                creator: { connect: { id: createdUser.id } },
              },
            }),
          ),
        );

        // CREATE DEFAULT RECRUITMENT PROCESS
        await Promise.all(
          defaultRecruitmentProcesses.map((element) =>
            prismaClient.recruitmentProcess.create({
              data: {
                ...element,
                business: { connect: { id: businessId } },
                creator: { connect: { id: createdUser.id } },
              },
            }),
          ),
        );

        // CREATE DEFAULT ONBOARDING PROCESS
        await Promise.all(
          defaultOnboardingProcesses.map((element) =>
            prismaClient.onboardingProcess.create({
              data: {
                ...element,
                business: { connect: { id: businessId } },
                creator: { connect: { id: createdUser.id } },
              },
            }),
          ),
        );

        // CREATE DEFAULT ATTENDANCE SETTINGS
        await prismaClient.attendanceSettings.create({
          data: {
            ...defaultAttendanceSettings,
            business: {
              connect: { id: businessId },
            },
          },
        });

        // CREATE DEFAULT LEAVE SETTINGS
        await prismaClient.leaveSettings.create({
          data: {
            ...leaveSettings,
            business: {
              connect: { id: businessId },
            },
          },
        });

        // CREATE DEFAULT PAYMENT SETTINGS
        await prismaClient.paymentSettings.create({
          data: {
            ...paymentSettings,
            businessId,
          },
        });

        // CREATE DEFAULT BUSINESS SETTINGS
        const identifierPrefix = createBusiness.name
          .split(' ')
          .map((word) => word[0])
          .join('')
          .toUpperCase();
        await prismaClient.businessSettings.create({
          data: {
            ...businessSettings,
            businessId,
            identifierPrefix,
            businessStartDay: 0,
            isSelfRegistered: false,
            deleteReadNotifications: DeleteReadNotifications.THIRTY_DAYS,
          },
        });

        return await prismaClient.business.findUnique({
          where: { id: createBusiness.id },
        });
      },
      {
        maxWait: 60000,
        timeout: 60000,
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
