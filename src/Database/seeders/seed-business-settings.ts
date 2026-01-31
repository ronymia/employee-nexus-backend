import type { Prisma } from 'generated/prisma';
import { businessSettings } from '../business-settings';

/**
 * Seeds business settings for a business
 */
export async function seedBusinessSettings(
  tx: Prisma.TransactionClient,
  businessId: number,
) {
  console.log('\n⚙️  Seeding business settings...');

  const settings = await tx.businessSettings.create({
    data: {
      businessId,
      identifierPrefix: businessSettings.identifierPrefix ?? '',
      businessStartDay: businessSettings.businessStartDay,
      currency: businessSettings.currency,
      theme: businessSettings.theme,
      deleteReadNotifications: businessSettings.deleteReadNotifications,
      businessTimeZone: businessSettings.businessTimeZone,
      googleApiKey: businessSettings.googleApiKey,
    },
  });

  console.log('✅ Created business settings:');
  console.log(`   - Currency: ${settings.currency}`);
  console.log(`   - Time zone: ${settings.businessTimeZone}`);
  console.log(
    `   - Business start day: ${settings.businessStartDay} (Saturday)`,
  );
  console.log(
    `   - Delete read notifications after: ${settings.deleteReadNotifications} days`,
  );

  return settings;
}
