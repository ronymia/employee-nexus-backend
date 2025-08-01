import { Injectable } from '@nestjs/common';

@Injectable()
export class RolePermissionsService {
  // constructor(private readonly prisma: PrismaService) {}
  // async create(createRolePermissionInput: CreateRolePermissionInput) {
  //   const role = await this.prisma.role.findUnique({
  //     where: { id: createRolePermissionInput.roleId },
  //   });
  //   if (!role) {
  //     throw new PreconditionFailedException('Invalid roleId: Role not found');
  //   }
  //   const permission = await this.prisma.permission.findUnique({
  //     where: { id: createRolePermissionInput.permissionId },
  //   });
  //   if (!permission) {
  //     throw new PreconditionFailedException(
  //       'Invalid permissionId: Permission not found',
  //     );
  //   }
  //   // RETURN
  //   return this.prisma.rolePermission.create({
  //     data: createRolePermissionInput,
  //     include: {
  //       role: true,
  //       permission: true,
  //     },
  //   });
  // }
  // findAll() {
  //   return this.prisma.rolePermission.findMany();
  // }
  // findOne(id: number) {
  //   return this.prisma.rolePermission.findUnique({
  //     where: { roleId_permissionId: { roleId: id, permissionId: id } },
  //   });
  // }
  // update(id: number, updateRolePermissionInput: UpdateRolePermissionInput) {
  //   return this.prisma.rolePermission.update({
  //     where: { roleId_permissionId: { roleId: id, permissionId: id } },
  //     data: updateRolePermissionInput,
  //   });
  // }
  // remove(id: number) {
  //   return this.prisma.rolePermission.delete({
  //     where: { roleId_permissionId: { roleId: id, permissionId: id } },
  //   });
  // }
}
