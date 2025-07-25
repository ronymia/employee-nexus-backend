import { Injectable } from '@nestjs/common';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPermissionInput: CreatePermissionInput) {
    return this.prisma.permission.create({
      data: createPermissionInput,
    });
  }

  findAll() {
    return this.prisma.permission.findMany();
  }

  findOne(id: number) {
    return this.prisma.permission.findUnique({
      where: { id },
    });
  }

  update(id: number, updatePermissionInput: UpdatePermissionInput) {
    return this.prisma.permission.update({
      where: { id },
      data: updatePermissionInput,
    });
  }

  remove(id: number) {
    return this.prisma.permission.delete({
      where: { id },
    });
  }
}
