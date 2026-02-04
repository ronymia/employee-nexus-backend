import { Prisma } from 'generated/prisma';
import {
  Gender,
  MaritalStatus,
  UserAccountStatus,
} from 'src/modules/users/enums';

interface CreateUserParams {
  tx: Prisma.TransactionClient;
  email: string;
  password: string;
  roleId: number;
  businessId: number;
  profileData: {
    fullName: string;
    phone: string;
    dateOfBirth: string;
    gender: Gender;
    address: string;
    city: string;
    country: string;
    postcode: string;
    maritalStatus: MaritalStatus;
  };
  employeeData: {
    employeeId: string;
    nidNumber: string;
    joiningDate: Date;
  };
  designationId: number;
  employmentStatusId: number;
  workScheduleId: number;
  workSiteId: number;
  salaryAmount: number;
  salaryType: 'MONTHLY' | 'HOURLY' | 'DAILY';
  startDate: Date;
}

export const createUserWithEmployee = async (params: CreateUserParams) => {
  const {
    tx,
    email,
    password,
    roleId,
    businessId,
    profileData,
    employeeData,
    designationId,
    employmentStatusId,
    workScheduleId,
    workSiteId,
    salaryAmount,
    salaryType,
    startDate,
  } = params;

  // Create user
  const user = await tx.user.create({
    data: {
      email,
      password,
      status: UserAccountStatus.ACTIVE,
      roleId,
      businessId,
    },
  });

  // Create profile
  await tx.profile.create({
    data: {
      userId: user.id,
      fullName: profileData.fullName,
      phone: profileData.phone,
      dateOfBirth: new Date(profileData.dateOfBirth).toISOString(),
      gender: profileData.gender,
      address: profileData.address,
      city: profileData.city,
      country: profileData.country,
      postcode: profileData.postcode,
      maritalStatus: profileData.maritalStatus,
    },
  });

  // Create employee
  await tx.employee.create({
    data: {
      userId: user.id,
      employeeId: employeeData.employeeId,
      nidNumber: employeeData.nidNumber,
      joiningDate: employeeData.joiningDate,
    },
  });

  // Assign designation
  await tx.employeeDesignation.create({
    data: {
      userId: user.id,
      designationId,
      startDate,
      isActive: true,
    },
  });

  // Assign employment status
  await tx.employeeStatus.create({
    data: {
      userId: user.id,
      employmentStatusId,
      startDate,
      isActive: true,
    },
  });

  // Assign work schedule
  await tx.employeeSchedule.create({
    data: {
      userId: user.id,
      workScheduleId,
      startDate,
      assignedBy: user.id, // Self-assigned for seeding
      notes: 'Initial schedule assignment upon employee creation',
    },
  });

  // Assign work site
  await tx.employeeWorkSite.create({
    data: {
      userId: user.id,
      workSiteId,
      startDate,
    },
  });

  // Assign salary
  await tx.employeeSalary.create({
    data: {
      userId: user.id,
      salaryAmount,
      salaryType,
      startDate,
      isActive: true,
      reason: 'Initial Salary',
    },
  });

  return user;
};
