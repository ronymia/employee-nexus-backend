import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.systemModule.findMany();
  }

  async findOne(id: number) {
    const result = await this.prisma.systemModule.findUnique({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(`System module with ID ${id} not found`);
    }
    return result;
  }
}
