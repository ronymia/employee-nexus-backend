import { Prisma } from 'generated/prisma';
import { ROLE } from 'src/enums';

export const seedBusinessRoles = async (
  tx: Prisma.TransactionClient,
  businessId: number,
) => {
  console.log('👔 Creating business roles...');

  const ownerRole = await tx.role.create({
    data: {
      name: ROLE.OWNER,
      businessId,
    },
  });
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

  return { ownerRole, adminRole, managerRole, employeeRole };
};
