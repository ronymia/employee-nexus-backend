import type { Prisma } from 'generated/prisma';
import { defaultLeaveTypes } from '../leave-type';

/**
 * Seeds all leave types for a business
 * Links leave types to all employment statuses
 */
export async function seedLeaveTypes(
  tx: Prisma.TransactionClient,
  businessId: number,
  employmentStatusIds: number[],
): Promise<
  Array<{ id: number; name: string; leaveType: string; leaveMinutes: number }>
> {
  console.log('\n🏖️  Seeding leave types...');

  const createdLeaveTypes: Array<{
    id: number;
    name: string;
    leaveType: string;
    leaveMinutes: number;
  }> = [];

  for (const leaveType of defaultLeaveTypes) {
    const createdLeaveType = await tx.leaveType.create({
      data: {
        name: leaveType.name,
        leaveType: leaveType.leaveType,
        leaveMinutes: leaveType.leaveMinutes,
        leaveRolloverType: leaveType.leaveRolloverType,
        status: 'ACTIVE',
        businessId,
        // Link to all employment statuses
        employmentStatuses: {
          create: employmentStatusIds.map((statusId) => ({
            employmentStatusId: statusId,
          })),
        },
      },
    });
    createdLeaveTypes.push(createdLeaveType);
  }

  console.log(`✅ Created ${createdLeaveTypes.length} leave types:`);
  createdLeaveTypes.forEach((type) => {
    console.log(
      `   - ${type.name} (${type.leaveType}, ${type.leaveMinutes} minutes)`,
    );
  });
  console.log(
    `   Each leave type linked to ${employmentStatusIds.length} employment statuses`,
  );

  return createdLeaveTypes;
}
