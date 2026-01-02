/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { QueryUserInput } from './dto/query-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { EmergencyContact, Prisma, Profile } from 'generated/prisma';
import { userSearchableFields } from './users.constant';
import { JwtPayload } from '../auth/jwt.strategy';
import { PasswordHelpers } from 'src/helpers/passwordHelpers';
import configuration from 'src/config/configuration';

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

  // GENERATE EMPLOYEE ID
  async generateEmployeeId(businessId: number): Promise<string> {
    // Get business settings for prefix
    const businessSettings = await this.prisma.businessSettings.findUnique({
      where: { businessId },
    });
    const prefix = businessSettings?.identifierPrefix || 'EMS';

    // Find the last employee with this prefix pattern
    const lastEmployee = await this.prisma.employee.findFirst({
      where: {
        user: {
          role: {
            businessId,
          },
        },
        employeeId: {
          startsWith: prefix,
        },
      },
      orderBy: {
        employeeId: 'desc',
      },
      select: {
        employeeId: true,
      },
    });

    let nextNumber = 1;

    if (lastEmployee?.employeeId) {
      // Split by '-' and get the number part
      const parts = lastEmployee.employeeId.split('-');
      if (parts.length > 1) {
        const lastNumber = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
    }

    // Generate new employee ID with padded number
    const newEmployeeId = `${prefix}-${String(nextNumber).padStart(4, '0')}`;
    return newEmployeeId;
  }

  // GET ALL
  async findAll({ user, query }: { user: JwtPayload; query?: QueryUserInput }) {
    // BUSINESS ID
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');
    // QUERY BUILDER
    const andCondition: Prisma.UserWhereInput[] = [];

    // Only include users who have employee records
    andCondition.push({
      employee: {
        isNot: null,
      },
    });

    // Filter by business (via role)
    if (businessId) {
      andCondition.push({
        businessId,
        role: {
          businessId,
        },
      });
    }

    // FILTER BY ROLE
    if (query?.role) {
      andCondition.push({
        role: {
          name: `${query.role}#${businessId}`,
          businessId,
        },
      });
    }

    // FILTER BY DEPARTMENT
    if (query?.departmentId) {
      andCondition.push({
        employee: {
          departments: {
            some: {
              departmentId: query.departmentId,
              isActive: true,
            },
          },
        },
      });
    }

    // FILTER BY DESIGNATION
    if (query?.designationId) {
      andCondition.push({
        employee: {
          designations: {
            some: {
              designationId: query.designationId,
              isActive: true,
            },
          },
        },
      });
    }

    // FILTER BY EMPLOYMENT STATUS
    if (query?.employmentStatusId) {
      andCondition.push({
        employee: {
          employmentStatuses: {
            some: {
              employmentStatusId: query.employmentStatusId,
              isActive: true,
            },
          },
        },
      });
    }

    // FILTER BY WORK SITE
    // if (query?.workSiteId) {
    //   andCondition.push({
    //     employee: {
    //       workSites: {
    //         some: {
    //           workSiteId: query.workSiteId,
    //         },
    //       },
    //     },
    //   });
    // }

    const whereCondition: Prisma.UserWhereInput =
      andCondition.length > 0 ? { AND: andCondition } : {};

    // Get total count for pagination
    const total = await this.prisma.user.count({
      where: {
        businessId,
      },
    });

    // GET ALL
    const pagination = query?.pagination;
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});
    const result = !limit
      ? await this.prisma.user.findMany({
          where: whereCondition,
          orderBy: {
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
                designations: {
                  include: {
                    designation: true,
                  },
                },
                employmentStatuses: {
                  include: {
                    employmentStatus: true,
                  },
                },
                departments: {
                  include: {
                    department: true,
                  },
                },
                workSites: {
                  include: {
                    workSite: true,
                  },
                },
                workSchedules: {
                  include: {
                    workSchedule: true,
                  },
                },
              },
            },
            role: true,
          },
        })
      : await this.prisma.user.findMany({
          where: whereCondition,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            profile: {
              include: {
                emergencyContact: true,
              },
            },
            employee: {
              include: {
                designations: {
                  include: {
                    designation: true,
                  },
                },
                employmentStatuses: {
                  include: {
                    employmentStatus: true,
                  },
                },
                departments: {
                  include: {
                    department: true,
                  },
                },
                workSites: {
                  include: {
                    workSite: true,
                  },
                },
                workSchedules: {
                  include: {
                    workSchedule: true,
                  },
                },
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

  // GET ONE
  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            emergencyContact: true,
            socialLink: true,
          },
        },
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
    authUser: JwtPayload,
  ) {
    const {
      user,
      profile,
      emergencyContact,
      workSiteIds,
      workScheduleId,
      departmentId,
      designationId,
      employmentStatusId,
      ...employeeData
    } = createEmployeeInput;

    // Validate that all related entities belong to the business
    const [designation, employmentStatus, department, workSchedule] =
      await Promise.all([
        this.prisma.designation.findUnique({
          where: {
            id: designationId,
            AND: { businessId: authUser.businessId },
          },
        }),
        this.prisma.employmentStatus.findUnique({
          where: {
            id: employmentStatusId,
            AND: { businessId: authUser.businessId },
          },
        }),
        this.prisma.department.findUnique({
          where: {
            id: departmentId,
            AND: { businessId: authUser.businessId },
          },
        }),
        this.prisma.workSchedule.findUnique({
          where: {
            id: workScheduleId,
            AND: { businessId: authUser.businessId },
          },
        }),
      ]);

    if (!designation)
      throw new HttpException(
        'Invalid designation',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    if (!employmentStatus)
      throw new HttpException(
        'Invalid employment status',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    if (!department)
      throw new HttpException(
        'Invalid department',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    if (!workSchedule)
      throw new HttpException(
        'Invalid work schedule',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    // Validate work sites if provided
    if (workSiteIds && workSiteIds.length > 0) {
      const workSites = await this.prisma.workSite.findMany({
        where: { id: { in: workSiteIds }, businessId: authUser.businessId },
      });
      if (workSites.length !== workSiteIds.length) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Validation failed',
            errors: {
              workSiteIds: ['One or more work sites are invalid'],
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    // Validate role belongs to business
    const role = await this.prisma.role.findFirst({
      where: { id: user.roleId, businessId: authUser.businessId },
    });
    if (!role)
      throw new HttpException('Invalid role', HttpStatus.UNPROCESSABLE_ENTITY);

    // Generate employeeId if not provided
    const generatedEmployeeId = await this.generateEmployeeId(
      authUser.businessId,
    );

    // ADD DEFAULT PASSWORD
    let hashedPassword: string;

    if (user.password) {
      hashedPassword = await PasswordHelpers.passwordHash(user.password);
    } else {
      hashedPassword = await PasswordHelpers.passwordHash(
        configuration().default_password.employee,
      );
    }
    // Use transaction for atomicity
    return this.prisma.$transaction(
      async (tx) => {
        // Create user with role and optional direct business connection
        const createdUser = await tx.user.create({
          data: {
            email: user.email,
            password: hashedPassword,
            roleId: role.id,
            businessId: authUser.businessId,
            status: 'ACTIVE',
          },
        });

        // Create profile linked to user
        await tx.profile.create({
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
              userId: createdUser.id,
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
        // ASSIGN WORK SCHEDULE
        if (workScheduleId) {
          await tx.employeeSchedule.create({
            data: {
              userId: createdUser.id,
              workScheduleId,
              startDate: new Date(),
              assignedBy: authUser.userId,
              notes: 'Initial schedule assignment upon employee creation',
            },
          });
        }

        // Create work site assignments if provided
        if (Array.isArray(workSiteIds) && workSiteIds.length > 0) {
          await tx.employeeWorkSite.createMany({
            data: workSiteIds.map((workSiteId) => ({
              userId: createdUser.id,
              workSiteId,
              startDate: new Date(),
            })),
          });
        }

        // ASSIGN DEPARTMENT
        if (departmentId) {
          await tx.employeeDepartment.create({
            data: {
              userId: createdUser.id,
              departmentId,
              startDate: new Date(),
              isPrimary: true,
            },
          });
        }

        // ASSIGN DESIGNATION
        if (designationId) {
          await tx.employeeDesignation.create({
            data: {
              userId: createdUser.id,
              designationId,
              startDate: new Date(),
              salary: employeeData.salaryPerMonth,
              remarks: `Initial schedule assignment upon employee creation`,
            },
          });
        }

        // ASSIGN EMPLOYMENT STATUS
        if (employmentStatusId) {
          await tx.employeeStatus.create({
            data: {
              userId: createdUser.id,
              employmentStatusId,
              startDate: new Date(),
              remarks: `Initial schedule assignment upon employee creation`,
            },
          });
        }

        const result = await tx.user.findUnique({
          where: {
            id: createdUser.id,
            AND: { businessId: authUser.businessId },
          },
          include: {
            profile: {
              include: {
                emergencyContact: true,
              },
            },
            employee: {
              include: {
                designations: {
                  include: {
                    designation: true,
                  },
                },
                employmentStatuses: {
                  include: {
                    employmentStatus: true,
                  },
                },
                departments: {
                  include: {
                    department: true,
                  },
                },
                workSchedules: {
                  include: {
                    workSchedule: true,
                  },
                },
                workSites: {
                  include: {
                    workSite: true,
                  },
                },
              },
            },
            role: true,
          },
        });

        return result;
      },
      { timeout: 10000 * 60 * 5, maxWait: 10000 * 60 * 5 },
    );
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
                designations: {
                  include: {
                    designation: true,
                  },
                },
                employmentStatuses: {
                  include: {
                    employmentStatus: true,
                  },
                },
                departments: {
                  include: {
                    department: true,
                  },
                },
                workSchedules: {
                  include: {
                    workSchedule: true,
                  },
                },
                workSites: {
                  include: {
                    workSite: true,
                  },
                },
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
                designations: {
                  include: {
                    designation: true,
                  },
                },
                employmentStatuses: {
                  include: {
                    employmentStatus: true,
                  },
                },
                departments: {
                  include: {
                    department: true,
                  },
                },
                workSchedules: {
                  include: {
                    workSchedule: true,
                  },
                },
                workSites: {
                  include: {
                    workSite: true,
                  },
                },
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
            designations: {
              include: {
                designation: true,
              },
            },
            employmentStatuses: {
              include: {
                employmentStatus: true,
              },
            },
            departments: {
              include: {
                department: true,
              },
            },
            workSchedules: {
              include: {
                workSchedule: true,
              },
            },
            workSites: {
              include: {
                workSite: true,
              },
            },
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
      workSiteIds,
      ...employmentDetails
    } = updateEmployeeInput;

    // Check if user exists and belongs to business
    const existingUser = await this.prisma.user.findUnique({
      where: { id, AND: { businessId } },
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

    if (!existingUser) {
      throw new Error('User not found');
    }
    if (!existingUser.employee) {
      throw new Error('User is not an employee');
    }
    if (existingUser.role?.businessId !== businessId) {
      throw new Error(
        'Unauthorized: Employee does not belong to this business',
      );
    }

    // Validate role if being updated
    if (userData?.roleId) {
      const role = await this.prisma.role.findFirst({
        where: { id: userData.roleId, businessId },
      });

      if (!role) {
        throw new Error('Invalid role');
      }
    }

    // VALIDATE DESIGNATION
    if (employmentDetails?.designationId) {
      const designation = await this.prisma.designation.findUnique({
        where: { id: employmentDetails.designationId, AND: { businessId } },
      });
      if (!designation || designation.businessId !== businessId)
        throw new Error('Invalid designation');
    }

    // VALIDATE EMPLOYMENT STATUS
    if (employmentDetails?.employmentStatusId) {
      const employmentStatus = await this.prisma.employmentStatus.findUnique({
        where: {
          id: employmentDetails.employmentStatusId,
          AND: { businessId },
        },
      });

      if (!employmentStatus) {
        throw new Error('Invalid employment status');
      }
    }

    // VALIDATE DEPARTMENT
    if (employmentDetails?.departmentId) {
      const department = await this.prisma.department.findUnique({
        where: { id: employmentDetails.departmentId, AND: { businessId } },
      });
      if (!department) {
        throw new Error('Invalid department');
      }
    }

    // VALIDATE WORK SITES
    if (workSiteIds && workSiteIds.length > 0) {
      const workSites = await this.prisma.workSite.findMany({
        where: {
          id: { in: workSiteIds },
          businessId,
        },
      });
      if (workSites.length !== workSiteIds.length) {
        throw new Error('One or more work sites are invalid');
      }
    }

    // VALIDATE WORK SCHEDULE
    if (employmentDetails?.workScheduleId) {
      const workSchedule = await this.prisma.workSchedule.findUnique({
        where: { id: employmentDetails.workScheduleId, AND: { businessId } },
      });
      if (!workSchedule) {
        throw new Error('Invalid work schedule');
      }
    }

    // ADD DEFAULT PASSWORD
    // let hashedPassword: string;

    // if (userData?.password) {
    //   hashedPassword = await PasswordHelpers.passwordHash(userData.password);
    // }
    // Use transaction for atomicity
    return this.prisma.$transaction(
      async (tx) => {
        // Update user if userData is provided
        // UPDATE USERS DATA
        if (userData) {
          if (Object.keys(userData).length > 0) {
            await tx.user.update({
              where: { id },
              data: {
                email: userData.email,
                // password: userData.password,
                roleId: userData.roleId,
              },
            });
          }
        }

        // Update profile if profile data is provided
        if (profile && existingUser.profile) {
          const profileUpdateData: Partial<Profile> = {};
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
          // console.log({ profile });
          if (Object.keys(profileUpdateData).length > 0) {
            await tx.profile.update({
              where: { userId: existingUser.id },
              data: profileUpdateData,
            });
          }
        }

        // Update or create emergency contact if provided
        if (emergencyContact) {
          if (existingUser.profile?.emergencyContact) {
            const emergencyUpdateData: Partial<EmergencyContact> = {};
            if (emergencyContact.name)
              emergencyUpdateData.name = emergencyContact.name;
            if (emergencyContact.phone)
              emergencyUpdateData.phone = emergencyContact.phone;
            if (emergencyContact.relation)
              emergencyUpdateData.relation = emergencyContact.relation;

            if (Object.keys(emergencyUpdateData).length > 0) {
              await tx.emergencyContact.update({
                where: { userId: existingUser.id },
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
                userId: existingUser.id,
              },
            });
          }
        }

        // Update employee if employee data is provided
        if (employmentDetails && existingUser?.employee?.userId) {
          await tx.employee.update({
            where: { userId: existingUser.id },
            data: employmentDetails,
          });
        }

        // Update work site assignments if workSiteIds is provided
        if (workSiteIds !== undefined) {
          // Delete existing work site assignments
          await tx.employeeWorkSite.deleteMany({
            where: { userId: existingUser.id },
          });

          // Create new work site assignments
          // if (workSiteIds.length > 0) {
          //   await tx.employeeWorkSite.createMany({
          //     data: workSiteIds.map((workSiteId) => ({
          //       userId: existingUser.id,
          //       workSiteId,
          //     })),
          //   });
          // }
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
                designations: {
                  include: {
                    designation: true,
                  },
                },
                employmentStatuses: {
                  include: {
                    employmentStatus: true,
                  },
                },
                departments: {
                  include: {
                    department: true,
                  },
                },
                workSchedules: {
                  include: {
                    workSchedule: true,
                  },
                },
                workSites: {
                  include: {
                    workSite: true,
                  },
                },
              },
            },
            role: true,
          },
        });
        return result;
      },
      { timeout: 10000 * 60 * 5, maxWait: 10000 * 60 * 5 },
    );
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
            designations: {
              include: {
                designation: true,
              },
            },
            employmentStatuses: {
              include: {
                employmentStatus: true,
              },
            },
            departments: {
              include: {
                department: true,
              },
            },
            workSchedules: {
              include: {
                workSchedule: true,
              },
            },
            workSites: {
              include: {
                workSite: true,
              },
            },
          },
        },
        role: true,
      },
    });
  }

  async getUserStatistics(businessId: number) {
    // Define role names
    const employeeRole = `employee#${businessId}`;
    const managerRole = `manager#${businessId}`;
    const adminRole = `admin#${businessId}`;

    // Statuses from enum
    const statuses = [
      'ACTIVE',
      'INACTIVE',
      'BLOCKED',
      'DELETED',
      'SUSPENDED',
      'VERIFIED',
      'UNVERIFIED',
      'TERMINATED',
      'RESIGNED',
      'RETIRED',
      'ON_LEAVE',
    ];

    // Parallel queries for efficiency
    const [
      totalUsers,
      totalEmployees,
      totalManagers,
      totalAdmins,
      ...statusCounts
    ] = await Promise.all([
      // Total users
      this.prisma.user.count({
        where: { businessId },
      }),
      // Total employees (users with employee records)
      this.prisma.user.count({
        where: {
          businessId,
          role: {
            name: employeeRole,
          },
        },
      }),
      // Total managers
      this.prisma.user.count({
        where: {
          businessId,
          role: {
            name: managerRole,
          },
        },
      }),
      // Total admins
      this.prisma.user.count({
        where: {
          businessId,
          role: {
            name: adminRole,
          },
        },
      }),
      // Status counts
      ...statuses.map((status) =>
        this.prisma.user.count({
          where: {
            businessId,
            status: status as any,
          },
        }),
      ),
    ]);

    // Build status object
    const statusStats = {};
    statuses.forEach((status, index) => {
      const camelCaseStatus = status
        .toLowerCase()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        .replace(/_([a-z])/g, (match, letter) => letter?.toUpperCase());
      statusStats[camelCaseStatus + 'Users'] = statusCounts[index] || 0;
    });

    return {
      totalUsers: totalUsers || 0,
      totalEmployees: totalEmployees || 0,
      totalManagers: totalManagers || 0,
      totalAdmins: totalAdmins || 0,
      ...statusStats,
    };
  }
}
