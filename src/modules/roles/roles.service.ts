import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../auth/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { ROLE } from 'src/enums';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}
  // create(createRoleInput: CreateRoleInput) {
  //   return this.prisma.role.create({ data: createRoleInput });
  // }
  async findAll(user: JwtPayload) {
    // const SYSTEM_ROLES = {
    //   OWNER: 'owner',
    //   SUPER_ADMIN: 'super_admin',
    // };
    const result = await this.prisma.role.findMany({
      where: {
        businessId: user.businessId,
        AND: {
          name: { not: ROLE.OWNER },
        },
      },
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
