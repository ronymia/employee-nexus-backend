import { Prisma } from 'generated/prisma';

export const seedBusinessSubscription = async (
  tx: Prisma.TransactionClient,
  businessId: number,
) => {
  console.log('📋 Creating business subscription...');

  // Find or create a subscription plan
  let subscriptionPlan = await tx.subscriptionPlan.findFirst({
    where: { name: 'Standard' },
  });

  if (!subscriptionPlan) {
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
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2025-01-01');
  const trialEndDate = new Date('2024-01-15');

  await tx.businessSubscription.create({
    data: {
      businessId,
      subscriptionPlanId: subscriptionPlan.id,
      startDate,
      endDate,
      trialEndDate,
      status: 'ACTIVE',
    },
  });
};
