import { Prisma } from 'generated/prisma';
import { createUserWithEmployee } from './create-user-employee';
import { Gender, MaritalStatus } from 'src/modules/users/enums';

export const seedAdmins = async (
  tx: Prisma.TransactionClient,
  params: {
    adminRoleId: number;
    businessId: number;
    adminPassword: string;
    designationId: number;
    employmentStatusId: number;
    workScheduleId: number;
    workSiteId: number;
  },
) => {
  console.log('👤 Creating 2 admins...');

  const adminData = [
    {
      email: 'admin1@techhive.com',
      fullName: 'Sarah Johnson',
      phone: '+1234567891',
      gender: Gender.FEMALE,
      dateOfBirth: '1990-03-20',
      employeeId: 'TH-ADM-001',
      nidNumber: 'NID-ADM-001',
    },
    {
      email: 'admin2@techhive.com',
      fullName: 'Michael Brown',
      phone: '+1234567892',
      gender: Gender.MALE,
      dateOfBirth: '1988-07-12',
      employeeId: 'TH-ADM-002',
      nidNumber: 'NID-ADM-002',
    },
  ];

  for (const admin of adminData) {
    await createUserWithEmployee({
      tx,
      email: admin.email,
      password: params.adminPassword,
      roleId: params.adminRoleId,
      businessId: params.businessId,
      profileData: {
        fullName: admin.fullName,
        phone: admin.phone,
        dateOfBirth: admin.dateOfBirth,
        gender: admin.gender,
        address: '456 Admin Avenue',
        city: 'New York',
        country: 'USA',
        postcode: '10002',
        maritalStatus: MaritalStatus.SINGLE,
      },
      employeeData: {
        employeeId: admin.employeeId,
        nidNumber: admin.nidNumber,
        joiningDate: new Date('2024-02-01'),
      },
      designationId: params.designationId,
      employmentStatusId: params.employmentStatusId,
      workScheduleId: params.workScheduleId,
      workSiteId: params.workSiteId,
      salaryAmount: 75000,
      salaryType: 'MONTHLY',
      startDate: new Date('2024-02-01'),
    });
  }
};
