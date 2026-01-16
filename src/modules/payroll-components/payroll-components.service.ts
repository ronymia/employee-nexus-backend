import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePayrollComponentInput,
  UpdatePayrollComponentInput,
  QueryPayrollComponentInput,
} from './dto';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class PayrollComponentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: JwtPayload, input: CreatePayrollComponentInput) {
    return this.prisma.payrollComponent.create({
      data: {
        name: input.name,
        code: input.code,
        description: input.description,
        componentType: input.componentType,
        calculationType: input.calculationType,
        defaultValue: input.defaultValue,
        isTaxable: input.isTaxable ?? true,
        isStatutory: input.isStatutory ?? false,
        displayOrder: input.displayOrder,
        businessId: user.businessId,
      },
    });
  }

  async findAll(user: JwtPayload, query: QueryPayrollComponentInput) {
    return this.prisma.payrollComponent.findMany({
      where: {
        businessId: user.businessId,
        ...(query.componentType && { componentType: query.componentType }),
      },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: number) {
    return this.prisma.payrollComponent.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string, businessId: number) {
    return this.prisma.payrollComponent.findUnique({
      where: {
        code_businessId: {
          code,
          businessId,
        },
      },
    });
  }

  async findActiveComponents(businessId: number) {
    return this.prisma.payrollComponent.findMany({
      where: {
        businessId,
      },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async update(input: UpdatePayrollComponentInput) {
    const { id, ...data } = input;
    return this.prisma.payrollComponent.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.payrollComponent.delete({
      where: { id },
    });
  }
}
