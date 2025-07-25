import { Injectable } from '@nestjs/common';
import { CreateRolePermissionInput } from './dto/create-role-permission.input';
import { UpdateRolePermissionInput } from './dto/update-role-permission.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolePermissionsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createRolePermissionInput: CreateRolePermissionInput) {
    return this.prisma.rolePermission.create({
      data: createRolePermissionInput,
    });
  }

  findAll() {
    return this.prisma.rolePermission.findMany();
  }

  findOne(id: number) {
    return this.prisma.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId: id, permissionId: id } },
    });
  }

  update(id: number, updateRolePermissionInput: UpdateRolePermissionInput) {
    return this.prisma.rolePermission.update({
      where: { roleId_permissionId: { roleId: id, permissionId: id } },
      data: updateRolePermissionInput,
    });
  }

  remove(id: number) {
    return this.prisma.rolePermission.delete({
      where: { roleId_permissionId: { roleId: id, permissionId: id } },
    });
  }
}
