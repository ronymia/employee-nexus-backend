/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSystemModuleInput } from './dto/create-system-module.input';
import { UpdateSystemModuleInput } from './dto/update-system-module.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemModulesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createSystemModuleInput: CreateSystemModuleInput) {
    return await this.prisma.systemModule.create({
      data: createSystemModuleInput,
    });
  }

  async findAll() {
    return await this.prisma.systemModule.findMany();
  }

  async findOne(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.prisma.systemModule.findUnique({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(`System module with ID ${id} not found`);
    }
    return result;
  }

  async update(id: number, updateSystemModuleInput: UpdateSystemModuleInput) {
    // Check if the system module exists
    await this.findOne(id);

    // Update the system module
    return await this.prisma.systemModule.update({
      where: { id },
      data: updateSystemModuleInput,
    });
  }

  async remove(id: number) {
    // Check if the system module exists before attempting to delete
    await this.findOne(id);

    return await this.prisma.systemModule.delete({
      where: { id },
    });
  }
}
