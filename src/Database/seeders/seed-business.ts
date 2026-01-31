import { Prisma } from 'generated/prisma';
import { ROLE } from 'src/enums';
import { PasswordHelpers } from 'src/helpers/passwordHelpers';
import {
  Gender,
  MaritalStatus,
  UserAccountStatus,
} from 'src/modules/users/enums';

export const seedBusiness = async (
  tx: Prisma.TransactionClient,
  ownerPassword: string,
  ownerRole: any,
) => {
  console.log('🏢 Creating business and owner...');

  // Create owner user
  const owner = await tx.user.create({
    data: {
      email: 'mdronymia040@gmail.com',
      password: ownerPassword,
      status: UserAccountStatus.ACTIVE,
      roleId: ownerRole.id,
    },
  });

  // Create owner profile
  await tx.profile.create({
    data: {
      userId: owner.id,
      fullName: 'Md Rony Mia',
      phone: '+1234567890',
      dateOfBirth: new Date('1985-05-15').toISOString(),
      gender: Gender.MALE,
      address: '123 Business Street',
      city: 'New York',
      country: 'USA',
      postcode: '10001',
      maritalStatus: MaritalStatus.MARRIED,
    },
  });

  // Create business
  const business = await tx.business.create({
    data: {
      name: 'TechHive Solutions',
      email: 'info@techhive.com',
      phone: '+1234567890',
      address: '123 Business Street, Suite 100',
      city: 'New York',
      country: 'USA',
      postcode: '10001',
      registrationDate: new Date('2024-01-01'),
      status: 'ACTIVE',
      isSelfRegistered: false,
      ownerId: owner.id,
    },
  });

  // Update owner with businessId
  await tx.user.update({
    where: { id: owner.id },
    data: { businessId: business.id },
  });

  return { business, owner };
};
