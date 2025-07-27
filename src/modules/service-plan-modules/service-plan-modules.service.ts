/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { CreateServicePlanModuleInput } from './dto/create-service-plan-module.input';
import { UpdateServicePlanModuleInput } from './dto/update-service-plan-module.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicePlanModulesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createServicePlanModuleInput: CreateServicePlanModuleInput) {
    return await this.prisma.servicePlanModule.create({
      data: createServicePlanModuleInput,
    });
  }

  async findAll() {
    return await this.prisma.servicePlanModule.findMany();
  }

  async findOne(servicePlanId: number, systemModuleId: number) {
    return await this.prisma.servicePlanModule.findUnique({
      where: {
        servicePlanId_systemModuleId: { servicePlanId, systemModuleId },
      },
    });
  }

  async update(
    servicePlanId: number,
    systemModuleId: number,
    updateServicePlanModuleInput: UpdateServicePlanModuleInput,
  ) {
    return await this.prisma.servicePlanModule.update({
      where: {
        servicePlanId_systemModuleId: { servicePlanId, systemModuleId },
      },
      data: updateServicePlanModuleInput,
    });
  }

  async remove(servicePlanId: number, systemModuleId: number) {
    return await this.prisma.servicePlanModule.delete({
      where: {
        servicePlanId_systemModuleId: { servicePlanId, systemModuleId },
      },
    });
  }
}
