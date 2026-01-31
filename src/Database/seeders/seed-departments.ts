import { Prisma } from 'generated/prisma';

export const seedDepartments = async (
  tx: Prisma.TransactionClient,
  businessId: number,
  createdManagers: { id: number; email: string }[],
) => {
  console.log('🏢 Creating departments...');
  await tx.department.create({
    data: {
      name: 'Human Resources',
      description: 'People, hiring, payroll and compliance',
      status: 'ACTIVE',
      businessId,
    },
  });

  await tx.department.create({
    data: {
      name: 'Finance',
      description: 'Accounting, billing, and financial planning',
      status: 'ACTIVE',
      businessId,
    },
  });

  await tx.department.create({
    data: {
      name: 'Sales & Marketing',
      description: 'Sales, marketing and customer acquisition',
      status: 'ACTIVE',
      businessId,
    },
  });

  // Create parent Engineering department
  const engineeringDept = await tx.department.create({
    data: {
      name: 'Engineering',
      description: 'Main engineering department overseeing all technical teams',
      status: 'ACTIVE',
      businessId,
    },
  });

  const frontendTeam = await tx.department.create({
    data: {
      name: 'Frontend Team',
      description:
        'Frontend development team working with React, Vue, and modern web technologies',
      status: 'ACTIVE',
      businessId,
      managerId: createdManagers[0]?.id,
      parentId: engineeringDept.id,
    },
  });

  const backendTeam = await tx.department.create({
    data: {
      name: 'Backend Team',
      description:
        'Backend development team working with Node.js, APIs, and server-side technologies',
      status: 'ACTIVE',
      businessId,
      managerId: createdManagers[1]?.id,
      parentId: engineeringDept.id,
    },
  });

  const fullstackTeam = await tx.department.create({
    data: {
      name: 'Full Stack Team',
      description:
        'Full stack development team handling both frontend and backend development',
      status: 'ACTIVE',
      businessId,
      parentId: engineeringDept.id,
    },
  });

  const devopsTeam = await tx.department.create({
    data: {
      name: 'DevOps Team',
      description:
        'DevOps and infrastructure team managing CI/CD, cloud, and deployment',
      status: 'ACTIVE',
      businessId,
      parentId: engineeringDept.id,
    },
  });
  const qaTestingTeam = await tx.department.create({
    data: {
      name: 'QA & Testing',
      description: 'Quality assurance and automation testing',
      status: 'ACTIVE',
      businessId,
      parentId: engineeringDept.id,
    },
  });

  return {
    engineeringDept,
    frontendTeam,
    backendTeam,
    fullstackTeam,
    devopsTeam,
    qaTestingTeam,
  };
};
