import { Prisma, PrismaClient } from 'generated/prisma';
import { ROLE } from 'src/enums';
import { PasswordHelpers } from 'src/helpers/passwordHelpers';
import configuration from 'src/config/configuration';
import {
  Gender,
  MaritalStatus,
  UserAccountStatus,
} from 'src/modules/users/enums';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

const prisma = new PrismaClient();

/**
 * Seeds a complete business with:
 * - 1 Business Owner
 * - 2 Admins
 * - 2 Managers
 * - 10 Employees
 */
export const seedBusinessWithUsers = async () => {
  console.log('🌱 Starting business and users seeding...');

  try {
    // 1. Create business owner user and profile first
    const ownerPassword = await PasswordHelpers.passwordHash('12345678@We');

    // Get or create OWNER role
    let ownerRole = await prisma.role.findFirst({
      where: {
        name: ROLE.OWNER,
        businessId: null,
      },
    });

    if (!ownerRole) {
      ownerRole = await prisma.role.create({
        data: { name: ROLE.OWNER },
      });
    }

    // Create the business with owner in a transaction
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
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
            dateOfBirth: dayjs.utc('1985-05-15').toISOString(),
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
            registrationDate: dayjs.utc('2024-01-01').toISOString(),
            status: 'ACTIVE',
            isSelfRegistered: false,
            ownerId: owner.id,
          },
        });
        await tx.user.update({
          where: { id: owner.id },
          data: { businessId: business.id },
        });
        // Find or create a subscription plan
        let subscriptionPlan = await tx.subscriptionPlan.findFirst({
          where: { name: 'Standard' },
        });

        if (!subscriptionPlan) {
          // Create a default subscription plan if it doesn't exist
          subscriptionPlan = await tx.subscriptionPlan.create({
            data: {
              name: 'Standard',
              description: 'Standard plan for businesses',
              price: 120,
              setupFee: 15,
              status: 'ACTIVE',
            },
          });
        }

        // Create business subscription
        const startDate = dayjs.utc('2024-01-01').toISOString();
        const endDate = dayjs.utc('2025-01-01').toISOString();
        const trialEndDate = dayjs.utc('2024-01-15').toISOString(); // 15 days trial

        await tx.businessSubscription.create({
          data: {
            businessId: business.id,
            subscriptionPlanId: subscriptionPlan.id,
            startDate,
            endDate,
            trialEndDate,
            status: 'ACTIVE',
          },
        });

        // Create roles for the business
        const adminRole = await tx.role.create({
          data: {
            name: ROLE.ADMIN,
            businessId: business.id,
          },
        });

        const managerRole = await tx.role.create({
          data: {
            name: ROLE.MANAGER,
            businessId: business.id,
          },
        });

        const employeeRole = await tx.role.create({
          data: {
            name: ROLE.EMPLOYEE,
            businessId: business.id,
          },
        });

        // Create default designation
        const designation = await tx.designation.create({
          data: {
            name: 'Software Developer',
            description: 'Software Developer',
            status: 'ACTIVE',
            businessId: business.id,
          },
        });

        // Create default employment status
        const employmentStatus = await tx.employmentStatus.create({
          data: {
            name: 'Full Time',
            description: 'Full-time employee',
            status: 'ACTIVE',
            businessId: business.id,
          },
        });

        // Common passwords
        const adminPassword = await PasswordHelpers.passwordHash(
          configuration().default_password.admin || '12345678@We',
        );
        const managerPassword = await PasswordHelpers.passwordHash(
          configuration().default_password.manager || '12345678@We',
        );
        const employeePassword = await PasswordHelpers.passwordHash(
          configuration().default_password.employee || '12345678@We',
        );

        // Store created users for department assignment
        const createdManagers: { id: number; email: string }[] = [];
        const createdEmployees: { id: number; email: string }[] = [];

        // Create 2 Admins
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
          const user = await tx.user.create({
            data: {
              email: admin.email,
              password: adminPassword,
              status: UserAccountStatus.ACTIVE,
              roleId: adminRole.id,
              businessId: business.id,
            },
          });

          await tx.profile.create({
            data: {
              userId: user.id,
              fullName: admin.fullName,
              phone: admin.phone,
              dateOfBirth: dayjs.utc(admin.dateOfBirth).toISOString(),
              gender: admin.gender,
              address: '456 Admin Avenue',
              city: 'New York',
              country: 'USA',
              postcode: '10002',
              maritalStatus: MaritalStatus.SINGLE,
            },
          });

          await tx.employee.create({
            data: {
              userId: user.id,
              employeeId: admin.employeeId,
              nidNumber: admin.nidNumber,
              joiningDate: dayjs.utc('2024-02-01').toISOString(),
            },
          });

          // Assign designation
          await tx.employeeDesignation.create({
            data: {
              userId: user.id,
              designationId: designation.id,
              startDate: dayjs.utc('2024-02-01').toISOString(),
              isActive: true,
            },
          });

          // Assign employment status
          await tx.employeeStatus.create({
            data: {
              userId: user.id,
              employmentStatusId: employmentStatus.id,
              startDate: dayjs.utc('2024-02-01').toISOString(),
              isActive: true,
            },
          });

          // Assign salary
          await tx.employeeSalary.create({
            data: {
              userId: user.id,
              salaryAmount: 75000,
              salaryType: 'MONTHLY',
              startDate: dayjs.utc('2024-02-01').toISOString(),
              isActive: true,
              reason: 'Initial Salary',
            },
          });
        }

        // Create 2 Managers
        console.log('👤 Creating 2 managers...');
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
          const user = await tx.user.create({
            data: {
              email: manager.email,
              password: managerPassword,
              status: UserAccountStatus.ACTIVE,
              roleId: managerRole.id,
              businessId: business.id,
            },
          });

          await tx.profile.create({
            data: {
              userId: user.id,
              fullName: manager.fullName,
              phone: manager.phone,
              dateOfBirth: dayjs.utc(manager.dateOfBirth).toISOString(),
              gender: manager.gender,
              address: '789 Manager Lane',
              city: 'New York',
              country: 'USA',
              postcode: '10003',
              maritalStatus: MaritalStatus.MARRIED,
            },
          });

          await tx.employee.create({
            data: {
              userId: user.id,
              employeeId: manager.employeeId,
              nidNumber: manager.nidNumber,
              joiningDate: dayjs.utc('2024-03-01').toISOString(),
            },
          });

          // Assign designation
          await tx.employeeDesignation.create({
            data: {
              userId: user.id,
              designationId: designation.id,
              startDate: dayjs.utc('2024-03-01').toISOString(),
              isActive: true,
            },
          });

          // Assign employment status
          await tx.employeeStatus.create({
            data: {
              userId: user.id,
              employmentStatusId: employmentStatus.id,
              startDate: dayjs.utc('2024-03-01').toISOString(),
              isActive: true,
            },
          });

          // Assign salary
          await tx.employeeSalary.create({
            data: {
              userId: user.id,
              salaryAmount: 65000,
              salaryType: 'MONTHLY',
              startDate: dayjs.utc('2024-03-01').toISOString(),
              isActive: true,
              reason: 'Initial Salary',
            },
          });

          createdManagers.push(user);
        }

        // Create 10 Employees
        console.log('👤 Creating 10 employees...');
        const employeeData = [
          {
            email: 'employee1@techhive.com',
            fullName: 'James Taylor',
            phone: '+1234567895',
            gender: Gender.MALE,
            dateOfBirth: '1995-01-10',
          },
          {
            email: 'employee2@techhive.com',
            fullName: 'Emma Martinez',
            phone: '+1234567896',
            gender: Gender.FEMALE,
            dateOfBirth: '1994-04-22',
          },
          {
            email: 'employee3@techhive.com',
            fullName: 'Robert Anderson',
            phone: '+1234567897',
            gender: Gender.MALE,
            dateOfBirth: '1996-08-15',
          },
          {
            email: 'employee4@techhive.com',
            fullName: 'Olivia Thomas',
            phone: '+1234567898',
            gender: Gender.FEMALE,
            dateOfBirth: '1993-12-30',
          },
          {
            email: 'employee5@techhive.com',
            fullName: 'William Jackson',
            phone: '+1234567899',
            gender: Gender.MALE,
            dateOfBirth: '1997-06-08',
          },
          {
            email: 'employee6@techhive.com',
            fullName: 'Sophia White',
            phone: '+1234567800',
            gender: Gender.FEMALE,
            dateOfBirth: '1995-02-14',
          },
          {
            email: 'employee7@techhive.com',
            fullName: 'Benjamin Harris',
            phone: '+1234567801',
            gender: Gender.MALE,
            dateOfBirth: '1994-10-20',
          },
          {
            email: 'employee8@techhive.com',
            fullName: 'Isabella Martin',
            phone: '+1234567802',
            gender: Gender.FEMALE,
            dateOfBirth: '1996-03-25',
          },
          {
            email: 'employee9@techhive.com',
            fullName: 'Lucas Thompson',
            phone: '+1234567803',
            gender: Gender.MALE,
            dateOfBirth: '1995-07-18',
          },
          {
            email: 'employee10@techhive.com',
            fullName: 'Mia Garcia',
            phone: '+1234567804',
            gender: Gender.FEMALE,
            dateOfBirth: '1997-11-12',
          },
        ];

        for (let i = 0; i < employeeData.length; i++) {
          const emp = employeeData[i];
          const user = await tx.user.create({
            data: {
              email: emp.email,
              password: employeePassword,
              status: UserAccountStatus.ACTIVE,
              roleId: employeeRole.id,
              businessId: business.id,
            },
          });

          await tx.profile.create({
            data: {
              userId: user.id,
              fullName: emp.fullName,
              phone: emp.phone,
              dateOfBirth: dayjs.utc(emp.dateOfBirth).toISOString(),
              gender: emp.gender,
              address: `${100 + i} Employee Street`,
              city: 'New York',
              country: 'USA',
              postcode: '10004',
              maritalStatus:
                i % 2 === 0 ? MaritalStatus.SINGLE : MaritalStatus.MARRIED,
            },
          });

          await tx.employee.create({
            data: {
              userId: user.id,
              employeeId: `TH-EMP-${String(i + 1).padStart(3, '0')}`,
              nidNumber: `NID-EMP-${String(i + 1).padStart(3, '0')}`,
              joiningDate: dayjs.utc('2024-04-01').toISOString(),
            },
          });

          // Assign designation
          await tx.employeeDesignation.create({
            data: {
              userId: user.id,
              designationId: designation.id,
              startDate: dayjs.utc('2024-04-01').toISOString(),
              isActive: true,
            },
          });

          // Assign employment status
          await tx.employeeStatus.create({
            data: {
              userId: user.id,
              employmentStatusId: employmentStatus.id,
              startDate: dayjs.utc('2024-04-01').toISOString(),
              isActive: true,
            },
          });

          // Assign salary
          await tx.employeeSalary.create({
            data: {
              userId: user.id,
              salaryAmount: 50000,
              salaryType: 'MONTHLY',
              startDate: dayjs.utc('2024-04-01').toISOString(),
              isActive: true,
              reason: 'Initial Salary',
            },
          });

          createdEmployees.push(user);
        }

        // Create Departments
        console.log('🏢 Creating departments...');

        // Create Frontend Team with first manager
        const frontendTeam = await tx.department.create({
          data: {
            name: 'Frontend Team',
            description:
              'Frontend development team working with React, Vue, and modern web technologies',
            status: 'ACTIVE',
            businessId: business.id,
            managerId: createdManagers[0]?.id,
          },
        });

        // Create Backend Team with second manager
        const backendTeam = await tx.department.create({
          data: {
            name: 'Backend Team',
            description:
              'Backend development team working with Node.js, APIs, and server-side technologies',
            status: 'ACTIVE',
            businessId: business.id,
            managerId: createdManagers[1]?.id,
          },
        });

        // Create Full Stack Team (no manager assigned, managed by admins)
        const fullstackTeam = await tx.department.create({
          data: {
            name: 'Full Stack Team',
            description:
              'Full stack development team handling both frontend and backend development',
            status: 'ACTIVE',
            businessId: business.id,
          },
        });

        // Create DevOps Team (no manager assigned)
        const devopsTeam = await tx.department.create({
          data: {
            name: 'DevOps Team',
            description:
              'DevOps and infrastructure team managing CI/CD, cloud, and deployment',
            status: 'ACTIVE',
            businessId: business.id,
          },
        });

        console.log('👥 Assigning employees to departments...');

        // Assign managers to their departments
        await tx.employeeDepartment.create({
          data: {
            userId: createdManagers[0].id,
            departmentId: frontendTeam.id,
            startDate: dayjs.utc('2024-03-01').toISOString(),
            isPrimary: true,
            isActive: true,
            roleInDept: 'manager',
          },
        });

        await tx.employeeDepartment.create({
          data: {
            userId: createdManagers[1].id,
            departmentId: backendTeam.id,
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
              departmentId: frontendTeam.id,
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
              departmentId: backendTeam.id,
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
              departmentId: fullstackTeam.id,
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
            departmentId: devopsTeam.id,
            startDate: dayjs.utc('2024-04-01').toISOString(),
            isPrimary: true,
            isActive: true,
            roleInDept: 'member',
          },
        });

        console.log('✅ Business seeding completed successfully!');
        return {
          business,
          owner,
          adminCount: 2,
          managerCount: 2,
          employeeCount: 10,
          departments: [
            { name: 'Frontend Team', manager: 'David Wilson', employees: 3 },
            { name: 'Backend Team', manager: 'Emily Davis', employees: 3 },
            { name: 'Full Stack Team', manager: 'None', employees: 3 },
            { name: 'DevOps Team', manager: 'None', employees: 1 },
          ],
        };
      },
    );

    console.log('\n📊 Seeding Summary:');
    console.log(`   Business: ${result.business.name}`);
    console.log(`   Owner: ${result.owner.email}`);
    console.log(`   Admins: ${result.adminCount}`);
    console.log(`   Managers: ${result.managerCount}`);
    console.log(`   Employees: ${result.employeeCount}`);
    console.log(
      `   Total Users: ${1 + result.adminCount + result.managerCount + result.employeeCount}`,
    );
    console.log('\n🏢 Departments Created:');
    result.departments.forEach((dept) => {
      console.log(
        `   - ${dept.name}: Manager: ${dept.manager}, Employees: ${dept.employees}`,
      );
    });

    return result;
  } catch (error) {
    console.error('❌ Error seeding business and users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Run the seeder if executed directly
if (require.main === module) {
  seedBusinessWithUsers()
    .then(() => {
      console.log('\n🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
