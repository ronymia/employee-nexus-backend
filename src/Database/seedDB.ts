import { Prisma, PrismaClient } from 'generated/prisma';
import configuration from 'src/config/configuration';
import { ROLE } from 'src/enums';
import { PasswordHelpers } from 'src/helpers/passwordHelpers';
import { seedNotificationTemplates } from './notification-templates';
import {
  Gender,
  MaritalStatus,
  UserAccountStatus,
} from 'src/modules/users/enums';

const prisma = new PrismaClient();

// SUPER ADMIN DATA
export const superUser = {
  email: 'rony.mia7800@gmail.com',
  status: UserAccountStatus.VERIFIED,
};

export const superAdminProfile = {
  fullName: 'MD Rony Mia',
  phone: '01321185989',
  dateOfBirth: new Date('1998-12-10').toISOString(),
  gender: Gender.MALE,
  address: 'west khabaspur,Faridpur Sadar,Faridpur',
  city: 'Faridpur',
  country: 'Bangladesh',
  postcode: '7800',
  maritalStatus: MaritalStatus.SINGLE,
};

// SEED SUPER ADMIN

export const seedSuperAdmin = async () => {
  // 1. Ensure SUPER_ADMIN role exists
  let role = await prisma.role.findUnique({
    where: {
      name_businessId: { name: ROLE.SUPER_ADMIN, businessId: null as any },
    },
  });

  if (!role) {
    role = await prisma.role.create({
      data: {
        name: ROLE.SUPER_ADMIN,
      },
    });
  }

  // 2. Check if a super admin user already exists
  const isSuperAdminExist = await prisma.user.findFirst({
    where: { roleId: role?.id },
  });

  if (!isSuperAdminExist) {
    const password = await PasswordHelpers.passwordHash(
      configuration().default_password.super_admin,
    );

    await prisma.$transaction(
      async (prismaClient: Prisma.TransactionClient) => {
        const res = await prismaClient.user.create({
          data: { ...superUser, roleId: role?.id, password },
        });

        await prismaClient.profile.create({
          data: {
            ...superAdminProfile,
            userId: res.id,
          },
        });
      },
    );
  }

  // Seed notification templates
  await seedNotificationTemplates();
};
