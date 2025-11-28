/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { QueryUserInput } from './dto/query-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { Prisma } from 'generated/prisma';
import { userSearchableFields } from './users.constant';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  // create(createUserInput: CreateUserInput) {
  //   return this.prisma.user.create({
  //     data: {
  //       email: createUserInput.email,
  //       password: createUserInput.password,
  //       role: { connect: { id: 1 } },
  //       ...(createUserInput.businessId && {
  //         businessId: createUserInput.businessId,
  //       }),
  //     },
  //     include: {
  //       profile: true,
  //       business: true,
  //       userPermissions: {
  //         include: {
  //           permission: { select: { resource: true, action: true } },
  //         },
  //       },
  //       role: {
  //         include: {
  //           rolePermissions: {
  //             include: {
  //               permission: { select: { resource: true, action: true } },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

  // GET ALL
  findAll() {
    return this.prisma.user.findMany({
      include: {
        profile: true,
        business: true,
        userPermissions: {
          include: {
            permission: { select: { resource: true, action: true } },
          },
        },
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: { select: { resource: true, action: true } },
              },
            },
          },
        },
      },
    });
  }

  // GET ONE
  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        business: true,
        userPermissions: {
          include: {
            permission: { select: { resource: true, action: true } },
          },
        },
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: { select: { resource: true, action: true } },
              },
            },
          },
        },
      },
    });
  }

  // USER BY EMAIL
  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        business: true,
        userPermissions: {
          include: {
            permission: { select: { resource: true, action: true } },
          },
        },
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }

  // UPDATE
  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return this.prisma.user.update({
  //     where: { id },
  //     data: updateUserInput,
  //   });
  // }

  // DELETE
  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
      include: {
        profile: true,
        business: true,
        userPermissions: {
          include: {
            permission: { select: { resource: true, action: true } },
          },
        },
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: { select: { resource: true, action: true } },
              },
            },
          },
        },
      },
    });
  }

  // ============ EMPLOYEE OPERATIONS ============

  async createEmployee(
    createEmployeeInput: CreateEmployeeInput,
    businessId: number,
  ) {
    const { user, profile, emergencyContact, ...employeeData } =
      createEmployeeInput;

    // Validate that all related entities belong to the business
    const [designation, employmentStatus, department, workSite, workSchedule] =
      await Promise.all([
        this.prisma.designation.findUnique({
          where: { id: employeeData.designationId },
        }),
        this.prisma.employmentStatus.findUnique({
          where: { id: employeeData.employmentStatusId },
        }),
        this.prisma.department.findUnique({
          where: { id: employeeData.departmentId },
        }),
        this.prisma.workSite.findUnique({
          where: { id: employeeData.workSiteId },
        }),
        this.prisma.workSchedule.findUnique({
          where: { id: employeeData.workScheduleId },
        }),
      ]);

    if (!designation || designation.businessId !== businessId)
      throw new Error('Invalid designation');
    if (!employmentStatus || employmentStatus.businessId !== businessId)
      throw new Error('Invalid employment status');
    if (!department || department.businessId !== businessId)
      throw new Error('Invalid department');
    if (!workSite || workSite.businessId !== businessId)
      throw new Error('Invalid work site');
    if (!workSchedule || workSchedule.businessId !== businessId)
      throw new Error('Invalid work schedule');

    // Validate role belongs to business
    const role = await this.prisma.role.findFirst({
      where: { id: user.roleId, businessId },
    });
    if (!role) throw new Error('Invalid role');

    // Generate employeeId if not provided
    let generatedEmployeeId = employeeData.employeeId;
    if (!generatedEmployeeId) {
      const businessSettings = await this.prisma.businessSettings.findUnique({
        where: { businessId },
      });
      const prefix = businessSettings?.identifierPrefix || 'EMP';
      const employeeCount = await this.prisma.employee.count({
        where: {
          user: {
            role: {
              businessId,
            },
          },
        },
      });
      generatedEmployeeId = `${prefix}-${String(employeeCount + 1).padStart(4, '0')}`;
    }

    // Use transaction for atomicity
    return this.prisma.$transaction(async (tx) => {
      // Create user with role and optional direct business connection
      const createdUser = await tx.user.create({
        data: {
          email: user.email,
          password: user.password,
          roleId: role.id,
          businessId,
        },
      });

      // Create profile linked to user
      const createdProfile = await tx.profile.create({
        data: {
          ...profile,
          userId: createdUser.id,
        },
      });

      // Create emergency contact if provided
      if (emergencyContact) {
        await tx.emergencyContact.create({
          data: {
            ...emergencyContact,
            profileId: createdProfile.id,
          },
        });
      }

      // Create employee linked to user
      await tx.employee.create({
        data: {
          ...employeeData,
          employeeId: generatedEmployeeId,
          userId: createdUser.id,
        },
      });

      const result = await tx.user.findUnique({
        where: {
          id: createdUser.id,
          AND: { businessId },
        },
        include: {
          profile: {
            include: {
              emergencyContact: true,
            },
          },
          employee: {
            include: {
              designation: true,
              employmentStatus: true,
              department: true,
              workSite: true,
              workSchedule: true,
            },
          },
          role: true,
        },
      });

      return result;
    });
  }

  async findAllEmployees({
    user,
    query,
  }: {
    user: JwtPayload;
    query?: QueryUserInput;
  }) {
    // BUSINESS ID
    const businessId = user.businessId;
    const { pagination, ...filters } = query ?? {};

    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    const { searchTerm } = filters;

    // QUERY BUILDER
    const andCondition: Prisma.UserWhereInput[] = [];

    // Filter by business (via role)
    if (businessId) {
      andCondition.push({
        businessId,
        role: {
          businessId,
        },
      });
    }

    // Only include users who have employee records
    andCondition.push({
      employee: {
        isNot: null,
      },
    });

    // Search in Field
    if (searchTerm) {
      andCondition.push({
        OR: userSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }

    const whereCondition: Prisma.UserWhereInput =
      andCondition.length > 0 ? { AND: andCondition } : {};

    // Get total count for pagination
    const total = await this.prisma.user.count({
      where: {
        businessId,
      },
    });

    // Fetch paginated results
    const result = !limit
      ? await this.prisma.user.findMany({
          where: whereCondition,
          orderBy: sortBy
            ? {
                [sortBy]: sortOrder,
              }
            : {
                createdAt: 'desc',
              },
          include: {
            profile: {
              include: {
                emergencyContact: true,
              },
            },
            employee: {
              include: {
                designation: true,
                employmentStatus: true,
                department: true,
                workSite: true,
                workSchedule: true,
              },
            },
            role: true,
          },
        })
      : await this.prisma.user.findMany({
          where: whereCondition,
          skip,
          take: limit,
          orderBy: sortBy
            ? {
                [sortBy]: sortOrder,
              }
            : {
                createdAt: 'desc',
              },
          include: {
            profile: {
              include: {
                emergencyContact: true,
              },
            },
            employee: {
              include: {
                designation: true,
                employmentStatus: true,
                department: true,
                workSite: true,
                workSchedule: true,
              },
            },
            role: true,
          },
        });

    return {
      meta: {
        page: page || 0,
        limit: limit || 0,
        skip: skip || 0,
        total: total || 0,
        totalPages: Math.ceil(total / (limit || 1)),
      },
      data: result,
    };
  }

  async findOneEmployee(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            emergencyContact: true,
          },
        },
        employee: {
          include: {
            designation: true,
            employmentStatus: true,
            department: true,
            workSite: true,
            workSchedule: true,
          },
        },
        role: true,
      },
    });
  }

  async updateEmployee(
    updateEmployeeInput: UpdateEmployeeInput,
    businessId: number,
  ) {
    const {
      id,
      user: userData,
      profile,
      emergencyContact,
      ...employee
    } = updateEmployeeInput;

    // Check if user exists and belongs to business
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        employee: true,
        profile: {
          include: {
            emergencyContact: true,
          },
        },
      },
    });

    if (!existingUser) throw new Error('User not found');
    if (!existingUser.employee) throw new Error('User is not an employee');
    if (existingUser.role?.businessId !== businessId)
      throw new Error(
        'Unauthorized: Employee does not belong to this business',
      );

    // Validate role if being updated
    if (userData?.roleId) {
      const role = await this.prisma.role.findFirst({
        where: { id: userData.roleId, businessId },
      });
      if (!role) throw new Error('Invalid role');
    }

    // Validate related entities if they are being updated
    if (employee?.designationId) {
      const designation = await this.prisma.designation.findUnique({
        where: { id: employee.designationId },
      });
      if (!designation || designation.businessId !== businessId)
        throw new Error('Invalid designation');
    }

    if (employee?.employmentStatusId) {
      const employmentStatus = await this.prisma.employmentStatus.findUnique({
        where: { id: employee.employmentStatusId },
      });
      if (!employmentStatus || employmentStatus.businessId !== businessId)
        throw new Error('Invalid employment status');
    }

    if (employee?.departmentId) {
      const department = await this.prisma.department.findUnique({
        where: { id: employee.departmentId },
      });
      if (!department || department.businessId !== businessId)
        throw new Error('Invalid department');
    }

    if (employee?.workSiteId) {
      const workSite = await this.prisma.workSite.findUnique({
        where: { id: employee.workSiteId },
      });
      if (!workSite || workSite.businessId !== businessId)
        throw new Error('Invalid work site');
    }

    if (employee?.workScheduleId) {
      const workSchedule = await this.prisma.workSchedule.findUnique({
        where: { id: employee.workScheduleId },
      });
      if (!workSchedule || workSchedule.businessId !== businessId)
        throw new Error('Invalid work schedule');
    }

    // Use transaction for atomicity
    return this.prisma.$transaction(async (tx) => {
      // Update user if userData is provided
      if (userData) {
        const userUpdateData: {
          email?: string;
          password?: string;
          roleId?: number;
        } = {};
        if (userData.email) userUpdateData.email = userData.email;
        if (userData.password) userUpdateData.password = userData.password;
        if (userData.roleId) userUpdateData.roleId = userData.roleId;

        if (Object.keys(userUpdateData).length > 0) {
          await tx.user.update({
            where: { id },
            data: userUpdateData,
          });
        }
      }

      // Update profile if profile data is provided
      if (profile && existingUser.profile) {
        const profileUpdateData: any = {};
        if (profile.fullName) profileUpdateData.fullName = profile.fullName;
        if (profile.phone) profileUpdateData.phone = profile.phone;
        if (profile.profilePicture !== undefined)
          profileUpdateData.profilePicture = profile.profilePicture;
        if (profile.dateOfBirth)
          profileUpdateData.dateOfBirth = profile.dateOfBirth;
        if (profile.gender) profileUpdateData.gender = profile.gender;
        if (profile.maritalStatus)
          profileUpdateData.maritalStatus = profile.maritalStatus;
        if (profile.address) profileUpdateData.address = profile.address;
        if (profile.city) profileUpdateData.city = profile.city;
        if (profile.country) profileUpdateData.country = profile.country;
        if (profile.postcode) profileUpdateData.postcode = profile.postcode;

        if (Object.keys(profileUpdateData).length > 0) {
          await tx.profile.update({
            where: { userId: id },
            data: profileUpdateData,
          });
        }
      }

      // Update or create emergency contact if provided
      if (emergencyContact) {
        if (existingUser.profile?.emergencyContact) {
          const emergencyUpdateData: any = {};
          if (emergencyContact.name)
            emergencyUpdateData.name = emergencyContact.name;
          if (emergencyContact.phone)
            emergencyUpdateData.phone = emergencyContact.phone;
          if (emergencyContact.relation)
            emergencyUpdateData.relation = emergencyContact.relation;

          if (Object.keys(emergencyUpdateData).length > 0) {
            await tx.emergencyContact.update({
              where: { profileId: existingUser.profile.id },
              data: emergencyUpdateData,
            });
          }
        } else if (
          existingUser.profile &&
          emergencyContact.name &&
          emergencyContact.phone &&
          emergencyContact.relation
        ) {
          await tx.emergencyContact.create({
            data: {
              name: emergencyContact.name,
              phone: emergencyContact.phone,
              relation: emergencyContact.relation,
              profileId: existingUser.profile.id,
            },
          });
        }
      }

      // Update employee if employee data is provided
      if (employee) {
        await tx.employee.update({
          where: { userId: id },
          data: employee,
        });
      }

      // Return updated employee with all relations
      const result = await tx.user.findUnique({
        where: {
          id: existingUser.id,
          AND: { businessId },
        },
        include: {
          profile: {
            include: {
              emergencyContact: true,
            },
          },
          employee: {
            include: {
              designation: true,
              employmentStatus: true,
              department: true,
              workSite: true,
              workSchedule: true,
            },
          },
          role: true,
        },
      });
      return result;
    });
  }

  async removeEmployee(id: number, businessId: number) {
    // Check if user exists and belongs to business
    const user = await this.prisma.user.findUnique({
      where: { id, AND: { businessId } },
      include: { role: true, employee: true },
    });

    if (!user) throw new Error('User not found');
    if (!user.employee) throw new Error('User is not an employee');
    if (user.role?.businessId !== businessId)
      throw new Error(
        'Unauthorized: Employee does not belong to this business',
      );

    // Delete user (will cascade to employee, profile, and emergency contact)
    return this.prisma.user.delete({
      where: { id, AND: { businessId } },
      include: {
        profile: {
          include: {
            emergencyContact: true,
          },
        },
        employee: {
          include: {
            designation: true,
            employmentStatus: true,
            department: true,
            workSite: true,
            workSchedule: true,
          },
        },
        role: true,
      },
    });
  }
}
