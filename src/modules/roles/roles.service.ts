import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../auth/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}
  // create(createRoleInput: CreateRoleInput) {
  //   return this.prisma.role.create({ data: createRoleInput });
  // }
  async findAll(user: JwtPayload) {
    const result = await this.prisma.role.findMany({
      where: { businessId: user.businessId },
      include: {
        business: true,
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return result;
  }
  // findOne(id: number) {
  //   return this.prisma.role.findUnique({ where: { id } });
  // }
  // update(id: number, updateRoleInput: UpdateRoleInput) {
  //   return this.prisma.role.update({ where: { id }, data: updateRoleInput });
  // }
  // remove(id: number) {
  //   return this.prisma.role.delete({ where: { id } });
  // }
}
