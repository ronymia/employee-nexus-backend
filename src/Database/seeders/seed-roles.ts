import { Prisma } from 'generated/prisma';
import { ROLE } from 'src/enums';

export const seedBusinessRoles = async (
  tx: Prisma.TransactionClient,
  businessId: number,
) => {
  console.log('👔 Creating business roles...');

  const adminRole = await tx.role.create({
    data: {
      name: ROLE.ADMIN,
      businessId,
    },
  });

  const managerRole = await tx.role.create({
    data: {
      name: ROLE.MANAGER,
      businessId,
    },
  });

  const employeeRole = await tx.role.create({
    data: {
      name: ROLE.EMPLOYEE,
      businessId,
    },
  });

  return { adminRole, managerRole, employeeRole };
};
