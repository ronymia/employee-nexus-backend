import {
  GENDER,
  Prisma,
  PrismaClient,
  ROLE,
  USER_ACCOUNT_STATUS,
} from 'generated/prisma';
import configuration from 'src/config/configuration';
import { PasswordHelpers } from 'src/helpers/passwordHelpers';

const prisma = new PrismaClient();

// SUPER ADMIN DATA
const superUser = {
  id: 1,
  email: 'mdronymia040@gmail.com',
  role: ROLE.SUPER_ADMIN,
  status: USER_ACCOUNT_STATUS.VERIFIED,
};

export const superAdminProfile = {
  full_name: 'MD Rony Mia',
  phone: '01321185989',
  dateOfBirth: new Date('1998-12-10').toISOString(),
  gender: GENDER.MALE,
  address: 'west khabaspur,Faridpur Sadar,Faridpur',
  city: 'Faridpur',
  country: 'Bangladesh',
  postcode: '7800',
};

// SEED SUPER ADMIN

export const seedSuperAdmin = async () => {
  const isSuperAdminExist = await prisma.user.findFirst({
    where: { role: ROLE.SUPER_ADMIN },
  });

  if (!isSuperAdminExist) {
    const password = await PasswordHelpers.passwordHash(
      configuration().default_password.super_admin,
    );

    await prisma.$transaction(
      async (prismaClient: Prisma.TransactionClient) => {
        const res = await prismaClient.user.create({
          data: { ...superUser, password },
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
};
