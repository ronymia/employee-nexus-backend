import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeaturesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.feature.findMany();
  }

  async findOne(id: number) {
    const result = await this.prisma.feature.findUnique({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(`Feature with ID ${id} not found`);
    }
    return result;
  }
}
