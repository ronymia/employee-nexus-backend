import type { Prisma } from 'generated/prisma';
import { defaultAttendanceSettings } from '../attendance-settings';

/**
 * Seeds attendance settings for a business
 */
export async function seedAttendanceSettings(
  tx: Prisma.TransactionClient,
  businessId: number,
) {
  console.log('\n⏰ Seeding attendance settings...');

  const attendanceSettings = await tx.attendanceSettings.create({
    data: {
      businessId,
      punchInTimeTolerance: defaultAttendanceSettings.punchInTimeTolerance,
      workAvailabilityDefinition:
        defaultAttendanceSettings.workAvailabilityDefinition,
      punchInOutAlert: defaultAttendanceSettings.punchInOutAlert,
      punchInOutInterval: defaultAttendanceSettings.punchInOutInterval,
      autoApproval: defaultAttendanceSettings.autoApproval,
      isGeoFencingEnabled: defaultAttendanceSettings.isGeoFencingEnabled,
    },
  });

  console.log('✅ Created attendance settings:');
  console.log(
    `   - Punch-in time tolerance: ${attendanceSettings.punchInTimeTolerance} minutes`,
  );
  console.log(
    `   - Work availability: ${attendanceSettings.workAvailabilityDefinition}%`,
  );
  console.log(
    `   - Auto approval: ${attendanceSettings.autoApproval ? 'Enabled' : 'Disabled'}`,
  );
  console.log(
    `   - Geo-fencing: ${attendanceSettings.isGeoFencingEnabled ? 'Enabled' : 'Disabled'}`,
  );

  return attendanceSettings;
}
