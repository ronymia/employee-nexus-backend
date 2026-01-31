import { Prisma } from 'generated/prisma';
import { createUserWithEmployee } from './create-user-employee';
import { Gender, MaritalStatus } from 'src/modules/users/enums';

export const seedManagers = async (
  tx: Prisma.TransactionClient,
  params: {
    managerRoleId: number;
    businessId: number;
    managerPassword: string;
    designationId: number;
    employmentStatusId: number;
    workScheduleId: number;
    workSiteId: number;
  },
) => {
  console.log('👤 Creating 2 managers...');

  const createdManagers: { id: number; email: string }[] = [];

  const managerData = [
    {
      email: 'manager1@techhive.com',
      fullName: 'David Wilson',
      phone: '+1234567893',
      gender: Gender.MALE,
      dateOfBirth: '1987-11-05',
      employeeId: 'TH-MGR-001',
      nidNumber: 'NID-MGR-001',
    },
    {
      email: 'manager2@techhive.com',
      fullName: 'Emily Davis',
      phone: '+1234567894',
      gender: Gender.FEMALE,
      dateOfBirth: '1989-09-18',
      employeeId: 'TH-MGR-002',
      nidNumber: 'NID-MGR-002',
    },
  ];

  for (const manager of managerData) {
    const user = await createUserWithEmployee({
      tx,
      email: manager.email,
      password: params.managerPassword,
      roleId: params.managerRoleId,
      businessId: params.businessId,
      profileData: {
        fullName: manager.fullName,
        phone: manager.phone,
        dateOfBirth: manager.dateOfBirth,
        gender: manager.gender,
        address: '789 Manager Lane',
        city: 'New York',
        country: 'USA',
        postcode: '10003',
        maritalStatus: MaritalStatus.MARRIED,
      },
      employeeData: {
        employeeId: manager.employeeId,
        nidNumber: manager.nidNumber,
        joiningDate: new Date('2024-03-01'),
      },
      designationId: params.designationId,
      employmentStatusId: params.employmentStatusId,
      workScheduleId: params.workScheduleId,
      workSiteId: params.workSiteId,
      salaryAmount: 65000,
      salaryType: 'MONTHLY',
      startDate: new Date('2024-03-01'),
    });

    createdManagers.push(user);
  }

  return createdManagers;
};
