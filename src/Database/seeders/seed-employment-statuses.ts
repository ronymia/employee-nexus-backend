import type { Prisma } from 'generated/prisma';
import { defaultEmploymentStatuses } from '../employment-status';

/**
 * Seeds all employment statuses for a business
 */
export async function seedEmploymentStatuses(
  tx: Prisma.TransactionClient,
  businessId: number,
): Promise<Array<{ id: number; name: string; description: string }>> {
  console.log('\n💼 Seeding employment statuses...');

  const createdStatuses: Array<{
    id: number;
    name: string;
    description: string;
  }> = [];

  for (const status of defaultEmploymentStatuses) {
    const employmentStatus = await tx.employmentStatus.create({
      data: {
        name: status.name,
        description: status.description,
        status: 'ACTIVE',
        businessId,
      },
    });
    createdStatuses.push(employmentStatus);
  }

  console.log(`✅ Created ${createdStatuses.length} employment statuses:`);
  createdStatuses.forEach((status) => {
    console.log(`   - ${status.name}`);
  });

  return createdStatuses;
}
