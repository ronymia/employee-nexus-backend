/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { CreateBusinessModuleInput } from './dto/create-business-module.input';
import { UpdateBusinessModuleInput } from './dto/update-business-module.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBusinessModuleInput: CreateBusinessModuleInput) {
    return await this.prisma.businessModule.create({
      data: createBusinessModuleInput,
    });
  }

  async findAll() {
    return await this.prisma.businessModule.findMany();
  }

  async findOne(businessId: number, systemModuleId: number) {
    return await this.prisma.businessModule.findUnique({
      where: {
        businessId_systemModuleId: { businessId, systemModuleId },
      },
    });
  }

  async update(
    businessId: number,
    systemModuleId: number,
    updateBusinessModuleInput: UpdateBusinessModuleInput,
  ) {
    return await this.prisma.businessModule.update({
      where: {
        businessId_systemModuleId: { businessId, systemModuleId },
      },
      data: updateBusinessModuleInput,
    });
  }

  async remove(businessId: number, systemModuleId: number) {
    return await this.prisma.businessModule.delete({
      where: {
        businessId_systemModuleId: { businessId, systemModuleId },
      },
    });
  }
}
