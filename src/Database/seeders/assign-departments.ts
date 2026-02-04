/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Prisma } from 'generated/prisma';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const assignEmployeesToDepartments = async (
  tx: Prisma.TransactionClient,
  params: {
    createdManagers: { id: number; email: string }[];
    createdEmployees: { id: number; email: string }[];
    departments: {
      frontendTeam: any;
      backendTeam: any;
      fullstackTeam: any;
      devopsTeam: any;
    };
  },
) => {
  console.log('👥 Assigning employees to departments...');

  const { createdManagers, createdEmployees, departments } = params;

  // Assign managers to their departments
  await tx.employeeDepartment.create({
    data: {
      userId: createdManagers[0].id,
      departmentId: departments.frontendTeam.id,
      startDate: dayjs.utc('2024-03-01').toISOString(),
      isPrimary: true,
      isActive: true,
      roleInDept: 'manager',
    },
  });

  await tx.employeeDepartment.create({
    data: {
      userId: createdManagers[1].id,
      departmentId: departments.backendTeam.id,
      startDate: dayjs.utc('2024-03-01').toISOString(),
      isPrimary: true,
      isActive: true,
      roleInDept: 'manager',
    },
  });

  // Assign first 3 employees to Frontend Team
  for (let i = 0; i < 3; i++) {
    await tx.employeeDepartment.create({
      data: {
        userId: createdEmployees[i].id,
        departmentId: departments.frontendTeam.id,
        startDate: dayjs.utc('2024-04-01').toISOString(),
        isPrimary: true,
        isActive: true,
        roleInDept: 'member',
      },
    });
  }

  // Assign next 3 employees to Backend Team
  for (let i = 3; i < 6; i++) {
    await tx.employeeDepartment.create({
      data: {
        userId: createdEmployees[i].id,
        departmentId: departments.backendTeam.id,
        startDate: dayjs.utc('2024-04-01').toISOString(),
        isPrimary: true,
        isActive: true,
        roleInDept: 'member',
      },
    });
  }

  // Assign next 3 employees to Full Stack Team
  for (let i = 6; i < 9; i++) {
    await tx.employeeDepartment.create({
      data: {
        userId: createdEmployees[i].id,
        departmentId: departments.fullstackTeam.id,
        startDate: dayjs.utc('2024-04-01').toISOString(),
        isPrimary: true,
        isActive: true,
        roleInDept: 'member',
      },
    });
  }

  // Assign 1 employee to DevOps Team
  await tx.employeeDepartment.create({
    data: {
      userId: createdEmployees[9].id,
      departmentId: departments.devopsTeam.id,
      startDate: dayjs.utc('2024-04-01').toISOString(),
      isPrimary: true,
      isActive: true,
      roleInDept: 'member',
    },
  });
};
