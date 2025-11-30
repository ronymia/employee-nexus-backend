import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeScheduleAssignmentInput } from './dto/create-employee-schedule-assignment.input';
import { UpdateEmployeeScheduleAssignmentInput } from './dto/update-employee-schedule-assignment.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class EmployeeScheduleAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    user,
    createEmployeeScheduleAssignmentInput,
  }: {
    user: JwtPayload;
    createEmployeeScheduleAssignmentInput: CreateEmployeeScheduleAssignmentInput;
  }) {
    const { userId, workScheduleId, isActive, ...assignmentData } =
      createEmployeeScheduleAssignmentInput;

    // Validate user exists and belongs to business
    const employee = await this.prisma.user.findFirst({
      where: {
        id: userId,
        role: { businessId: user.businessId },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Validate work schedule exists and belongs to business
    const workSchedule = await this.prisma.workSchedule.findFirst({
      where: {
        id: workScheduleId,
        businessId: user.businessId,
      },
    });

    if (!workSchedule) {
      throw new NotFoundException('Work schedule not found');
    }

    // If setting as active, deactivate other active assignments for this user
    if (isActive) {
      await this.prisma.employeeScheduleAssignment.updateMany({
        where: {
          userId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    }

    return await this.prisma.employeeScheduleAssignment.create({
      data: {
        ...assignmentData,
        userId,
        workScheduleId,
        isActive,
        assignedBy: user.userId,
      },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
        workSchedule: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async findAll({ user }: { user: JwtPayload }) {
    return await this.prisma.employeeScheduleAssignment.findMany({
      where: {
        user: {
          role: {
            businessId: user.businessId,
          },
        },
      },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
        workSchedule: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUserId({ user, userId }: { user: JwtPayload; userId: number }) {
    return await this.prisma.employeeScheduleAssignment.findMany({
      where: {
        userId,
        user: {
          role: {
            businessId: user.businessId,
          },
        },
      },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
        workSchedule: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findActiveByUserId({
    user,
    userId,
  }: {
    user: JwtPayload;
    userId: number;
  }) {
    return await this.prisma.employeeScheduleAssignment.findFirst({
      where: {
        userId,
        isActive: true,
        user: {
          role: {
            businessId: user.businessId,
          },
        },
      },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
        workSchedule: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const assignment = await this.prisma.employeeScheduleAssignment.findFirst({
      where: {
        id,
        user: {
          role: {
            businessId: user.businessId,
          },
        },
      },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
        workSchedule: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException(
        `Employee schedule assignment with ID ${id} not found`,
      );
    }

    return assignment;
  }

  async update({
    user,
    id,
    updateEmployeeScheduleAssignmentInput,
  }: {
    user: JwtPayload;
    id: number;
    updateEmployeeScheduleAssignmentInput: UpdateEmployeeScheduleAssignmentInput;
  }) {
    await this.findOne({ user, id });

    const { isActive, ...updateData } = updateEmployeeScheduleAssignmentInput;

    // If setting as active, deactivate other active assignments for this user
    if (isActive) {
      const assignment =
        await this.prisma.employeeScheduleAssignment.findUnique({
          where: { id },
        });

      if (assignment) {
        await this.prisma.employeeScheduleAssignment.updateMany({
          where: {
            userId: assignment.userId,
            isActive: true,
            id: { not: id },
          },
          data: {
            isActive: false,
          },
        });
      }
    }

    return await this.prisma.employeeScheduleAssignment.update({
      where: { id },
      data: {
        ...updateData,
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
        workSchedule: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id });

    return await this.prisma.employeeScheduleAssignment.delete({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
        workSchedule: true,
        assignedByUser: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
}
