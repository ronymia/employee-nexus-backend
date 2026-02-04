import { Prisma } from 'generated/prisma';
import { seedEmploymentStatuses } from './seed-employment-statuses';
import { seedLeaveTypes } from './seed-leave-types';
import { seedDesignations } from './seed-designations';

export const seedMasterData = async (
  tx: Prisma.TransactionClient,
  businessId: number,
) => {
  console.log(
    '📚 Creating master data (designations, employment statuses, leave types, work schedule, work site)...',
  );

  // Create all designations
  const designations = await seedDesignations(tx, businessId);

  // Create all employment statuses
  const employmentStatuses = await seedEmploymentStatuses(tx, businessId);

  // Create all leave types linked to employment statuses
  await seedLeaveTypes(
    tx,
    businessId,
    employmentStatuses.map((status) => status.id),
  );

  // Create default work schedule
  const workSchedule = await tx.workSchedule.create({
    data: {
      name: 'Standard 9-5',
      description: 'Standard 9 AM to 5 PM work schedule',
      status: 'ACTIVE',
      scheduleType: 'REGULAR',
      breakType: 'PAID',
      breakMinutes: 60,
      businessId,
    },
  });

  // Create default work site
  const workSite = await tx.workSite.create({
    data: {
      name: 'Main Office',
      description: 'Main office location',
      status: 'ACTIVE',
      address: '123 Business Street, Suite 100, New York, USA',
      locationTrackingType: 'NONE',
      businessId,
    },
  });

  return {
    designations,
    employmentStatuses,
    workSchedule,
    workSite,
  };
};
