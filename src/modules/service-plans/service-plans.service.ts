import { Injectable } from '@nestjs/common';
import { CreateServicePlanInput } from './dto/create-service-plan.input';
import { UpdateServicePlanInput } from './dto/update-service-plan.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class ServicePlansService {
  constructor(private readonly prisma: PrismaService) {}

  create(user: JwtPayload, createServicePlanInput: CreateServicePlanInput) {
    return this.prisma.servicePlan.create({
      data: { ...createServicePlanInput, createdBy: user?.userId },
      include: {
        creator: true,
      },
    });
  }

  findAll() {
    return this.prisma.servicePlan.findMany();
  }

  findOne(id: number) {
    return this.prisma.servicePlan.findUnique({
      where: { id },
    });
  }

  update(id: number, updateServicePlanInput: UpdateServicePlanInput) {
    return this.prisma.servicePlan.update({
      where: { id },
      data: updateServicePlanInput,
    });
  }

  remove(id: number) {
    return this.prisma.servicePlan.delete({
      where: { id },
    });
  }
}
