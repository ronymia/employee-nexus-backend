import type { Prisma } from 'generated/prisma';
import { leaveSettings } from '../leave-settings';

/**
 * Seeds leave settings for a business
 */
export async function seedLeaveSettings(
  tx: Prisma.TransactionClient,
  businessId: number,
) {
  console.log('\n🏖️  Seeding leave settings...');

  const leaveSettingsData = await tx.leaveSettings.create({
    data: {
      businessId,
      startMonth: leaveSettings.startMonth,
      autoApproval: leaveSettings.autoApproval,
    },
  });

  console.log('✅ Created leave settings:');
  console.log(
    `   - Leave year start month: ${leaveSettingsData.startMonth} (January)`,
  );
  console.log(
    `   - Auto approval: ${leaveSettingsData.autoApproval ? 'Enabled' : 'Disabled'}`,
  );

  return leaveSettingsData;
}
