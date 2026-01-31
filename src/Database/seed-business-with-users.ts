import { Prisma, PrismaClient } from 'generated/prisma';
import { ROLE } from 'src/enums';
import { PasswordHelpers } from 'src/helpers/passwordHelpers';
import configuration from 'src/config/configuration';
import { seedBusiness } from './seeders/seed-business';
import { seedBusinessSubscription } from './seeders/seed-subscription';
import { seedBusinessRoles } from './seeders/seed-roles';
import { seedMasterData } from './seeders/seed-master-data';
import { seedAdmins } from './seeders/seed-admins';
import { seedManagers } from './seeders/seed-managers';
import { seedEmployees } from './seeders/seed-employees';
import { seedDepartments } from './seeders/seed-departments';
import { assignEmployeesToDepartments } from './seeders/assign-departments';
import { seedProjects } from './seeders/seed-projects';
import { seedBangladeshHolidays } from './seeders/seed-holidays';
import { seedProjectMembers } from './seeders/seed-project-members';
import { seedBusinessSettings } from './seeders/seed-business-settings';
import { seedAttendanceSettings } from './seeders/seed-attendance-settings';
import { seedLeaveSettings } from './seeders/seed-leave-settings';
import { seedNotificationTemplates } from './seeders/seed-notification-templates';
import { seedAssetTypes } from './seeders/seed-asset-types';
import { seedAssets } from './seeders/seed-assets';
import { seedAssetAssignments } from './seeders/seed-asset-assignments';

const prisma = new PrismaClient();

/**
 * Seeds a complete business with:
 * - 1 Business Owner
 * - 2 Admins
 * - 2 Managers
 * - 20 Employees (14 Full Time, 3 Part Time, 2 Contractors, 1 Intern)
 * - 5 Departments (with hierarchy)
 * - 7 Designations (Senior PHP Dev, Frontend, Backend, Full Stack, Web Designer, Finance Manager, HR Manager)
 * - 6 Employment Statuses (On Leave, Full Time, Part Time, Intern, Contractor, Temporary)
 * - 6 Leave Types (Vacation, Sick, Personal, Maternity, Paternity, Bereavement)
 * - 5 Projects with 32 member assignments
 * - 14 Bangladesh Holidays
 * - Business Settings (Currency, Timezone, etc.)
 * - Attendance Settings
 * - Leave Settings
 * - 18 Notification Templates
 * - 10 Asset Types (Laptop, Monitor, Phone, etc.)
 * - 20 Assets with unique codes
 * - 17 Asset Assignments to employees
 * - Master data (Work Schedule, Work Site)
 */
export const seedBusinessWithUsers = async () => {
  console.log('🌱 Starting business and users seeding...');

  try {
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

    // Create the business with all related data in a transaction
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // 1. Create business and owner
        const { business, owner } = await seedBusiness(
          tx,
          ownerPassword,
          ownerRole,
        );

        // 2. Create business subscription
        await seedBusinessSubscription(tx, business.id);

        // 3. Create business roles
        const { adminRole, managerRole, employeeRole } =
          await seedBusinessRoles(tx, business.id);

        // 4. Create master data (designations, employment statuses, leave types, work schedule, work site)
        const { designations, employmentStatuses, workSchedule, workSite } =
          await seedMasterData(tx, business.id);

        // Get Full Time employment status as default
        const fullTimeStatus = employmentStatuses.find(
          (status) => status.name === 'Full Time',
        );

        if (!fullTimeStatus) {
          throw new Error('Full Time employment status not found');
        }

        // Get default designation (Backend Developer)
        const defaultDesignation =
          designations.find((d) => d.name === 'Backend Developer') ||
          designations[0];

        // Prepare common passwords
        const adminPassword = await PasswordHelpers.passwordHash(
          configuration().default_password.admin || 'AdminPass123',
        );
        const managerPassword = await PasswordHelpers.passwordHash(
          configuration().default_password.manager || 'ManagerPass123',
        );
        const employeePassword = await PasswordHelpers.passwordHash(
          configuration().default_password.employee || 'EmployeePass123',
        );

        // 5. Create admins
        await seedAdmins(tx, {
          adminRoleId: adminRole.id,
          businessId: business.id,
          adminPassword,
          designationId: defaultDesignation.id,
          employmentStatusId: fullTimeStatus.id,
          workScheduleId: workSchedule.id,
          workSiteId: workSite.id,
        });

        // 6. Create managers
        const createdManagers = await seedManagers(tx, {
          managerRoleId: managerRole.id,
          businessId: business.id,
          managerPassword,
          designationId: defaultDesignation.id,
          employmentStatusId: fullTimeStatus.id,
          workScheduleId: workSchedule.id,
          workSiteId: workSite.id,
        });

        // 7. Create employees with varied employment statuses and designations
        const createdEmployees = await seedEmployees(tx, {
          employeeRoleId: employeeRole.id,
          businessId: business.id,
          employeePassword,
          designationId: defaultDesignation.id,
          employmentStatusId: fullTimeStatus.id,
          workScheduleId: workSchedule.id,
          workSiteId: workSite.id,
          employmentStatuses, // Pass all statuses for varied assignments
          designations, // Pass all designations for varied assignments
        });

        // 8. Create departments
        const departments = await seedDepartments(
          tx,
          business.id,
          createdManagers,
        );

        // 9. Assign employees to departments
        await assignEmployeesToDepartments(tx, {
          createdManagers,
          createdEmployees,
          departments,
        });

        // 10. Create 5 projects
        const projects = await seedProjects(tx, business.id, owner.id);

        // 11. Create Bangladesh holidays
        await seedBangladeshHolidays(tx, business.id);

        // 12. Assign employees to projects
        await seedProjectMembers(tx, projects, createdEmployees);

        // 13. Create business settings
        await seedBusinessSettings(tx, business.id);

        // 14. Create attendance settings
        await seedAttendanceSettings(tx, business.id);

        // 15. Create leave settings
        await seedLeaveSettings(tx, business.id);

        // 16. Create notification templates
        await seedNotificationTemplates(tx, business.id);

        // 17. Create asset types
        const assetTypes = await seedAssetTypes(tx, business.id);

        // 18. Create assets
        const assets = await seedAssets(tx, business.id, assetTypes);

        // 19. Assign assets to employees (using first admin as the assigner)
        const adminUsers = await tx.user.findMany({
          where: { businessId: business.id, roleId: adminRole.id },
          select: { id: true },
          take: 1,
        });
        const firstAdminId = adminUsers[0]?.id || owner.id;
        await seedAssetAssignments(
          tx,
          assets,
          createdEmployees.map((e) => e.id),
          firstAdminId,
        );

        console.log('✅ Business seeding completed successfully!');
        return {
          business,
          owner,
          adminCount: 2,
          managerCount: 2,
          employeeCount: 20,
          projectCount: projects.length,
          assetTypeCount: assetTypes.length,
          assetCount: assets.length,
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
    console.log(`   Projects: ${result.projectCount}`);
    console.log(`   Asset Types: ${result.assetTypeCount}`);
    console.log(`   Assets: ${result.assetCount}`);
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
