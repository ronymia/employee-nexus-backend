import { Injectable } from '@nestjs/common';
import { PrismaService } from './modules/prisma/prisma.service';
import { ROLE } from './enums';
import { PasswordHelpers } from './helpers/passwordHelpers';
import { Prisma } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';
import { superAdminProfile, superUser } from './Database';
import configuration from './config/configuration';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  // ROLE REFRESH
  async roleRefresh() {
    return this.prisma.role.createMany({
      data: [
        {
          name: ROLE.SUPER_ADMIN,
        },
        {
          name: ROLE.OWNER,
        },
        {
          name: ROLE.MANAGER,
        },
        {
          name: ROLE.ADMIN,
        },
        {
          name: ROLE.EMPLOYEE,
        },
      ],
      skipDuplicates: true,
    });
  }

  // SETUP

  async seedSuperAdmin() {
    // 1. Ensure SUPER_ADMIN role exists
    let role = await this.prisma.role.findUnique({
      where: { name: ROLE.SUPER_ADMIN },
    });

    if (!role) {
      role = await this.prisma.role.create({
        data: {
          name: ROLE.SUPER_ADMIN,
        },
      });
    }

    // 2. Check if a super admin user already exists
    const isSuperAdminExist = await this.prisma.user.findFirst({
      where: { roleId: role?.id },
    });

    if (!isSuperAdminExist) {
      const password = await PasswordHelpers.passwordHash(
        configuration().default_password.super_admin as string,
      );

      await this.prisma.$transaction(
        async (prismaClient: Prisma.TransactionClient) => {
          const res = await prismaClient.user.create({
            data: { ...superUser, roleId: role?.id, password },
          });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          await prismaClient.profile.create({
            data: {
              ...superAdminProfile,
              userId: res.id,
            },
          });
        },
      );
    }
  }
  async setup() {
    // 1. Ensure SUPER_ADMIN role exists
    let role = await this.prisma.role.findUnique({
      where: { name: ROLE.SUPER_ADMIN },
    });

    if (!role) {
      role = await this.prisma.role.create({
        data: {
          name: ROLE.SUPER_ADMIN,
        },
      });
    }

    // 2. Check if a super admin user already exists
    const isSuperAdminExist = await this.prisma.user.findFirst({
      where: { roleId: role?.id },
    });

    if (!isSuperAdminExist) {
      const password = await PasswordHelpers.passwordHash(
        this.configService.get(
          configuration().default_password.super_admin as string,
        ),
      );

      await this.prisma.$transaction(
        async (prismaClient: Prisma.TransactionClient) => {
          const res = await prismaClient.user.create({
            data: { ...superUser, roleId: role?.id, password },
          });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          await prismaClient.profile.create({
            data: {
              ...superAdminProfile,
              userId: res.id,
            },
          });
        },
      );
    }
  }
}
