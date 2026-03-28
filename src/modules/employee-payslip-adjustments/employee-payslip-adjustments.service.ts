import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePayslipAdjustmentInput,
  QueryPayslipAdjustmentInput,
  UpdatePayslipAdjustmentInput,
  ApproveRejectPayslipAdjustmentInput,
} from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { Prisma } from 'generated/prisma';
import { AdjustmentStatus } from './enums/adjustment-status.enum';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

@Injectable()
export class EmployeePayslipAdjustmentsService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE PAYSLIP ADJUSTMENT
  async create({
    user,
    input,
  }: {
    user: JwtPayload;
    input: CreatePayslipAdjustmentInput;
  }) {
    // Verify employee exists and belongs to same business
    await this.prisma.user.findUniqueOrThrow({
      where: {
        id: input.userId,
        businessId: user.businessId,
      },
    });

    // Verify component exists if provided
    if (input.payrollComponentId) {
      await this.prisma.payrollComponent.findUniqueOrThrow({
        where: {
          id: input.payrollComponentId,
          businessId: user.businessId,
        },
      });
    }

    // Create adjustment
    return await this.prisma.payslipAdjustment.create({
      data: {
        ...input,
        requestedBy: user.userId,
        status: AdjustmentStatus.APPROVED,
      },
      include: {
        payrollComponent: true,
        requestedByUser: {
          include: {
            profile: true,
          },
        },
        reviewer: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  // UPDATE PAYSLIP ADJUSTMENT
  async update({
    user,
    input,
  }: {
    user: JwtPayload;
    input: UpdatePayslipAdjustmentInput;
  }) {
    if (!user.businessId) {
      throw new NotFoundException('Business not found for user');
    }

    // Find the adjustment and verify ownership
    const adjustment = await this.prisma.payslipAdjustment.findUniqueOrThrow({
      where: { id: input.id },
      include: {
        employee: true,
      },
    });

    // Only allow updating if status is PENDING
    if (adjustment.status !== AdjustmentStatus.PENDING) {
      throw new Error('Cannot update adjustment that is not pending');
    }

    // Update the adjustment
    return await this.prisma.payslipAdjustment.update({
      where: { id: input.id },
      data: input,
      include: {
        employee: {
          include: {
            user: true,
          },
        },
        payrollComponent: true,
        requestedByUser: {
          include: {
            profile: true,
          },
        },
        reviewer: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  // APPROVE OR REJECT PAYSLIP ADJUSTMENT
  async approveReject({
    user,
    input,
  }: {
    user: JwtPayload;
    input: ApproveRejectPayslipAdjustmentInput;
  }) {
    if (!user.businessId) {
      throw new NotFoundException('Business not found for user');
    }

    // Find the adjustment and verify it exists
    const adjustment = await this.prisma.payslipAdjustment.findUniqueOrThrow({
      where: { id: input.id },
      include: {
        employee: true,
      },
    });

    // Only allow approving/rejecting if status is PENDING
    if (adjustment.status !== AdjustmentStatus.PENDING) {
      throw new Error('Can only approve/reject pending adjustments');
    }

    // Update the adjustment status
    return await this.prisma.payslipAdjustment.update({
      where: { id: input.id },
      data: {
        status: input.status,
        reviewedBy: user.userId,
        reviewedAt: dayjs.utc().toISOString(),
        notes: input.notes || adjustment.notes,
      },
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        payrollComponent: true,
        requestedByUser: {
          include: {
            profile: true,
          },
        },
        reviewer: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  // GET ALL PAYSLIP ADJUSTMENTS
  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query?: QueryPayslipAdjustmentInput;
  }) {
    const businessId = user.businessId;
    if (!businessId) {
      throw new NotFoundException('Business not found');
    }
    const { ...filters } = query ?? {};

    // FILTER
    const { userId, payrollComponentId, status } = filters;

    // QUERY BUILDER
    const andCondition: Prisma.PayslipAdjustmentWhereInput[] = [];

    // Filter by userId
    if (userId) {
      andCondition.push({ userId });
    }

    // Filter by componentId
    if (payrollComponentId) {
      andCondition.push({ payrollComponentId });
    }

    // Filter by status
    if (status) {
      andCondition.push({ status });
    }

    const whereCondition: Prisma.PayslipAdjustmentWhereInput =
      andCondition.length ? { AND: andCondition } : {};

    const result = await this.prisma.payslipAdjustment.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        payrollComponent: true,
        requestedByUser: {
          include: {
            profile: true,
          },
        },
        reviewer: {
          include: {
            profile: true,
          },
        },
      },
    });

    return result;
  }

  // GET ONE PAYSLIP ADJUSTMENT
  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    if (!user.businessId) {
      throw new NotFoundException('Business not found for user');
    }

    // Find the adjustment
    const adjustment = await this.prisma.payslipAdjustment.findUniqueOrThrow({
      where: { id },
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        payrollComponent: true,
        requestedByUser: {
          include: {
            profile: true,
          },
        },
        reviewer: {
          include: {
            profile: true,
          },
        },
      },
    });

    return adjustment;
  }

  // GET PENDING PAYSLIP ADJUSTMENTS
  async pendingAdjustments({
    user,
    query,
  }: {
    user: JwtPayload;
    query?: QueryPayslipAdjustmentInput;
  }) {
    const businessId = user.businessId;
    if (!businessId) {
      throw new NotFoundException('Business not found');
    }
    const { ...filters } = query ?? {};

    // FILTER
    const { userId, payrollComponentId } = filters;

    // QUERY BUILDER
    const andCondition: Prisma.PayslipAdjustmentWhereInput[] = [];

    // Filter by userId
    if (userId) {
      andCondition.push({ userId });
    }

    // Filter by componentId
    if (payrollComponentId) {
      andCondition.push({ payrollComponentId });
    }

    // Only pending adjustments
    andCondition.push({ status: AdjustmentStatus.PENDING });

    const whereCondition: Prisma.PayslipAdjustmentWhereInput =
      andCondition.length ? { AND: andCondition } : {};

    const result = await this.prisma.payslipAdjustment.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        payrollComponent: true,
        requestedByUser: {
          include: {
            profile: true,
          },
        },
        reviewer: {
          include: {
            profile: true,
          },
        },
      },
    });

    return result;
  }

  // GET APPROVED PAYSLIP ADJUSTMENTS
  async approvedAdjustments({
    user,
    query,
  }: {
    user: JwtPayload;
    query?: QueryPayslipAdjustmentInput;
  }) {
    const businessId = user.businessId;
    if (!businessId) {
      throw new NotFoundException('Business not found');
    }
    const { ...filters } = query ?? {};

    // FILTER
    const { userId, payrollComponentId } = filters;

    // QUERY BUILDER
    const andCondition: Prisma.PayslipAdjustmentWhereInput[] = [];

    // Filter by userId
    if (userId) {
      andCondition.push({ userId });
    }

    // Filter by componentId
    if (payrollComponentId) {
      andCondition.push({ payrollComponentId });
    }

    // Only approved adjustments
    andCondition.push({ status: AdjustmentStatus.APPROVED });

    const whereCondition: Prisma.PayslipAdjustmentWhereInput =
      andCondition.length ? { AND: andCondition } : {};

    const result = await this.prisma.payslipAdjustment.findMany({
      where: whereCondition,
      orderBy: { reviewedAt: 'desc' },
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        payrollComponent: true,
        requestedByUser: {
          include: {
            profile: true,
          },
        },
        reviewer: {
          include: {
            profile: true,
          },
        },
      },
    });

    return result;
  }
}
