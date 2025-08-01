/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}
  // async create(createModuleInput: CreateModuleInput) {
  //   return await this.prisma.module.create({
  //     data: createModuleInput,
  //   });
  // }

  async findAll() {
    return await this.prisma.module.findMany();
  }

  async findOne(id: number) {
    const result = await this.prisma.module.findUnique({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }
    return result;
  }
}
