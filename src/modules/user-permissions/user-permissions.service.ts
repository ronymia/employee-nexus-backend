import { Injectable } from '@nestjs/common';
import { CreateUserPermissionInput } from './dto/create-user-permission.input';
import { UpdateUserPermissionInput } from './dto/update-user-permission.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserPermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserPermissionInput: CreateUserPermissionInput) {
    return this.prisma.userPermission.create({
      data: createUserPermissionInput,
    });
  }

  findAll() {
    return this.prisma.userPermission.findMany();
  }

  findOne(id: number) {
    return this.prisma.userPermission.findUnique({
      where: { userId_permissionId: { userId: id, permissionId: id } },
    });
  }

  update(id: number, updateUserPermissionInput: UpdateUserPermissionInput) {
    return this.prisma.userPermission.update({
      where: { userId_permissionId: { userId: id, permissionId: id } },
      data: updateUserPermissionInput,
    });
  }

  remove(id: number) {
    return this.prisma.userPermission.delete({
      where: { userId_permissionId: { userId: id, permissionId: id } },
    });
  }
}
