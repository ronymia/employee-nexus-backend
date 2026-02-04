/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Prisma } from 'generated/prisma';
import { createUserWithEmployee } from './create-user-employee';
import { Gender, MaritalStatus } from 'src/modules/users/enums';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const seedEmployees = async (
  tx: Prisma.TransactionClient,
  params: {
    employeeRoleId: number;
    businessId: number;
    employeePassword: string;
    designationId: number;
    employmentStatusId: number;
    workScheduleId: number;
    workSiteId: number;
    employmentStatuses?: any[]; // Optional array of all employment statuses
    designations?: any[]; // Optional array of all designations
  },
) => {
  console.log('👤 Creating 20 employees...');

  const createdEmployees: { id: number; email: string }[] = [];

  // Employment status assignment map (by index)
  // Full Time: 14 employees (employees 0-13)
  // Part Time: 3 employees (employees 14-16)
  // Contractor: 2 employees (employees 17-18)
  // Intern: 1 employee (employee 19)
  const getEmploymentStatusId = (index: number): number => {
    if (!params.employmentStatuses || params.employmentStatuses.length === 0) {
      return params.employmentStatusId; // Default fallback
    }

    const fullTime = params.employmentStatuses.find(
      (s) => s.name === 'Full Time',
    );
    const partTime = params.employmentStatuses.find(
      (s) => s.name === 'Part Time',
    );
    const contractor = params.employmentStatuses.find(
      (s) => s.name === 'Contractor',
    );
    const intern = params.employmentStatuses.find((s) => s.name === 'Intern');

    if (index >= 0 && index <= 13) {
      return fullTime?.id || params.employmentStatusId;
    } else if (index >= 14 && index <= 16) {
      return partTime?.id || params.employmentStatusId;
    } else if (index >= 17 && index <= 18) {
      return contractor?.id || params.employmentStatusId;
    } else if (index === 19) {
      return intern?.id || params.employmentStatusId;
    }

    return params.employmentStatusId;
  };

  // Designation assignment map (by index)
  // Rotating through available designations for variety
  const getDesignationId = (index: number): number => {
    if (!params.designations || params.designations.length === 0) {
      return params.designationId; // Default fallback
    }

    const seniorPhpDev = params.designations.find(
      (d) => d.name === 'Senior PHP Developer',
    );
    const frontendDev = params.designations.find(
      (d) => d.name === 'Frontend Developer',
    );
    const backendDev = params.designations.find(
      (d) => d.name === 'Backend Developer',
    );
    const fullStackDev = params.designations.find(
      (d) => d.name === 'Full Stack Developer',
    );
    const webDesigner = params.designations.find(
      (d) => d.name === 'Web Designer',
    );
    const financeManager = params.designations.find(
      (d) => d.name === 'Finance Manager',
    );
    const hrManager = params.designations.find((d) => d.name === 'HR Manager');

    // Assign designations to create diverse team
    const designationMap: { [key: number]: any } = {
      0: seniorPhpDev,
      1: frontendDev,
      2: backendDev,
      3: fullStackDev,
      4: webDesigner,
      5: seniorPhpDev,
      6: frontendDev,
      7: backendDev,
      8: fullStackDev,
      9: frontendDev,
      10: backendDev,
      11: fullStackDev,
      12: frontendDev,
      13: backendDev,
      14: webDesigner,
      15: frontendDev,
      16: backendDev,
      17: financeManager,
      18: hrManager,
      19: frontendDev, // Intern
    };

    return designationMap[index]?.id || params.designationId;
  };

  const employeeData = [
    {
      email: 'employee1@techhive.com',
      fullName: 'James Taylor',
      phone: '+1234567895',
      gender: Gender.MALE,
      dateOfBirth: dayjs.utc('1995-05-10').toISOString(),
      joiningDate: dayjs.utc('2023-01-15').toISOString(),
      salaryAmount: 45000,
    },
    {
      email: 'employee2@techhive.com',
      fullName: 'Emma Martinez',
      phone: '+1234567896',
      gender: Gender.FEMALE,
      dateOfBirth: dayjs.utc('1994-04-22').toISOString(),
      joiningDate: dayjs.utc('2023-02-20').toISOString(),
      salaryAmount: 48000,
    },
    {
      email: 'employee3@techhive.com',
      fullName: 'Robert Anderson',
      phone: '+1234567897',
      gender: Gender.MALE,
      dateOfBirth: dayjs.utc('1996-08-15').toISOString(),
      joiningDate: dayjs.utc('2023-03-10').toISOString(),
      salaryAmount: 52000,
    },
    {
      email: 'employee4@techhive.com',
      fullName: 'Olivia Thomas',
      phone: '+1234567898',
      gender: Gender.FEMALE,
      dateOfBirth: dayjs.utc('1993-12-30').toISOString(),
      joiningDate: dayjs.utc('2023-04-05').toISOString(),
      salaryAmount: 55000,
    },
    {
      email: 'employee5@techhive.com',
      fullName: 'William Jackson',
      phone: '+1234567899',
      gender: Gender.MALE,
      dateOfBirth: dayjs.utc('1997-06-08').toISOString(),
      joiningDate: dayjs.utc('2023-05-12').toISOString(),
      salaryAmount: 47000,
    },
    {
      email: 'employee6@techhive.com',
      fullName: 'Sophia White',
      phone: '+1234567800',
      gender: Gender.FEMALE,
      dateOfBirth: dayjs.utc('1994-09-14').toISOString(),
      joiningDate: dayjs.utc('2023-06-18').toISOString(),
      salaryAmount: 50000,
    },
    {
      email: 'employee7@techhive.com',
      fullName: 'Benjamin Harris',
      phone: '+1234567801',
      gender: Gender.MALE,
      dateOfBirth: dayjs.utc('1994-10-20').toISOString(),
      joiningDate: dayjs.utc('2023-07-22').toISOString(),
      salaryAmount: 53000,
    },
    {
      email: 'employee8@techhive.com',
      fullName: 'Isabella Martin',
      phone: '+1234567802',
      gender: Gender.FEMALE,
      dateOfBirth: dayjs.utc('1996-03-25').toISOString(),
      joiningDate: dayjs.utc('2023-08-30').toISOString(),
      salaryAmount: 49000,
    },
    {
      email: 'employee9@techhive.com',
      fullName: 'Lucas Thompson',
      phone: '+1234567803',
      gender: Gender.MALE,
      dateOfBirth: dayjs.utc('1995-07-18').toISOString(),
      joiningDate: dayjs.utc('2023-09-15').toISOString(),
      salaryAmount: 51000,
    },
    {
      email: 'employee10@techhive.com',
      fullName: 'Mia Garcia',
      phone: '+1234567804',
      gender: Gender.FEMALE,
      dateOfBirth: dayjs.utc('1997-11-12').toISOString(),
      joiningDate: dayjs.utc('2023-10-08').toISOString(),
      salaryAmount: 46000,
    },
    {
      email: 'employee11@techhive.com',
      fullName: 'Alexander Moore',
      phone: '+1234567805',
      gender: Gender.MALE,
      dateOfBirth: dayjs.utc('1996-05-05').toISOString(),
      joiningDate: dayjs.utc('2023-11-20').toISOString(),
      salaryAmount: 54000,
    },
    {
      email: 'employee12@techhive.com',
      fullName: 'Charlotte Lee',
      phone: '+1234567806',
      gender: Gender.FEMALE,
      dateOfBirth: dayjs.utc('1995-09-17').toISOString(),
      joiningDate: dayjs.utc('2023-12-05').toISOString(),
      salaryAmount: 48500,
    },
    {
      email: 'employee13@techhive.com',
      fullName: 'Daniel Walker',
      phone: '+1234567807',
      gender: Gender.MALE,
      dateOfBirth: dayjs.utc('1994-03-03').toISOString(),
      joiningDate: dayjs.utc('2024-01-10').toISOString(),
      salaryAmount: 56000,
    },
    {
      email: 'employee14@techhive.com',
      fullName: 'Amelia Hall',
      phone: '+1234567808',
      gender: Gender.FEMALE,
      dateOfBirth: dayjs.utc('1997-01-28').toISOString(),
      joiningDate: dayjs.utc('2024-02-14').toISOString(),
      salaryAmount: 47500,
    },
    {
      email: 'employee15@techhive.com',
      fullName: 'Matthew Allen',
      phone: '+1234567809',
      gender: Gender.MALE,
      dateOfBirth: dayjs.utc('1996-12-11').toISOString(),
      joiningDate: dayjs.utc('2024-03-20').toISOString(),
      salaryAmount: 52500,
    },
    {
      email: 'employee16@techhive.com',
      fullName: 'Ava Young',
      phone: '+1234567810',
      gender: Gender.FEMALE,
      dateOfBirth: dayjs.utc('1995-08-23').toISOString(),
      joiningDate: dayjs.utc('2024-04-08').toISOString(),
      salaryAmount: 49500,
    },
    {
      email: 'employee17@techhive.com',
      fullName: 'Ethan King',
      phone: '+1234567811',
      gender: Gender.MALE,
      dateOfBirth: dayjs.utc('1994-06-19').toISOString(),
      joiningDate: dayjs.utc('2024-05-15').toISOString(),
      salaryAmount: 55500,
    },
    {
      email: 'employee18@techhive.com',
      fullName: 'Harper Wright',
      phone: '+1234567812',
      gender: Gender.FEMALE,
      dateOfBirth: dayjs.utc('1997-04-08').toISOString(),
      joiningDate: dayjs.utc('2024-06-22').toISOString(),
      salaryAmount: 48000,
    },
    {
      email: 'employee19@techhive.com',
      fullName: 'Christopher Lopez',
      phone: '+1234567813',
      gender: Gender.MALE,
      dateOfBirth: dayjs.utc('1995-10-30').toISOString(),
      joiningDate: dayjs.utc('2024-07-30').toISOString(),
      salaryAmount: 51500,
    },
    {
      email: 'employee20@techhive.com',
      fullName: 'Evelyn Hill',
      phone: '+1234567814',
      gender: Gender.FEMALE,
      dateOfBirth: dayjs.utc('1996-02-16').toISOString(),
      joiningDate: dayjs.utc('2024-08-12').toISOString(),
      salaryAmount: 50500,
    },
  ];

  for (let i = 0; i < employeeData.length; i++) {
    const emp = employeeData[i];
    const employmentStatusId = getEmploymentStatusId(i);
    const designationId = getDesignationId(i);

    const user = await createUserWithEmployee({
      tx,
      email: emp.email,
      password: params.employeePassword,
      roleId: params.employeeRoleId,
      businessId: params.businessId,
      profileData: {
        fullName: emp.fullName,
        phone: emp.phone,
        dateOfBirth: emp.dateOfBirth,
        gender: emp.gender,
        address: `${100 + i} Employee Street`,
        city: 'New York',
        country: 'USA',
        postcode: '10004',
        maritalStatus:
          i % 2 === 0 ? MaritalStatus.SINGLE : MaritalStatus.MARRIED,
      },
      employeeData: {
        employeeId: `TH-EMP-${String(i + 1).padStart(3, '0')}`,
        nidNumber: `NID-EMP-${String(i + 1).padStart(3, '0')}`,
        joiningDate: dayjs.utc(emp.joiningDate).toISOString(),
      },
      designationId: designationId,
      employmentStatusId: employmentStatusId,
      workScheduleId: params.workScheduleId,
      workSiteId: params.workSiteId,
      salaryAmount: emp.salaryAmount,
      salaryType: 'MONTHLY',
      startDate: dayjs.utc(emp.joiningDate).toISOString(),
    });

    createdEmployees.push(user);
  }

  console.log('✅ Created 20 employees with varied data:');
  console.log('   Employment Statuses:');
  console.log('     - Full Time: 14 employees');
  console.log('     - Part Time: 3 employees');
  console.log('     - Contractor: 2 employees');
  console.log('     - Intern: 1 employee');
  console.log('   Designations:');
  console.log('     - Senior PHP Developer: 2 employees');
  console.log('     - Frontend Developer: 5 employees');
  console.log('     - Backend Developer: 6 employees');
  console.log('     - Full Stack Developer: 4 employees');
  console.log('     - Web Designer: 2 employees');
  console.log('     - Finance Manager: 1 employee');
  console.log('     - HR Manager: 1 employee (Contractor)');

  return createdEmployees;
};
