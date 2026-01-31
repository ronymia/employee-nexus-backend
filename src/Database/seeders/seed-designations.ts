import type { Prisma } from 'generated/prisma';
import { defaultDesignations } from '../designation';

/**
 * Seeds all designations for a business
 */
export async function seedDesignations(
  tx: Prisma.TransactionClient,
  businessId: number,
): Promise<Array<{ id: number; name: string; description: string }>> {
  console.log('\n💼 Seeding designations...');

  const createdDesignations: Array<{
    id: number;
    name: string;
    description: string;
  }> = [];

  for (const designation of defaultDesignations) {
    const createdDesignation = await tx.designation.create({
      data: {
        name: designation.name,
        description: designation.description,
        status: 'ACTIVE',
        businessId,
      },
    });
    createdDesignations.push(createdDesignation);
  }

  console.log(`✅ Created ${createdDesignations.length} designations:`);
  createdDesignations.forEach((designation) => {
    console.log(`   - ${designation.name}`);
  });

  return createdDesignations;
}
