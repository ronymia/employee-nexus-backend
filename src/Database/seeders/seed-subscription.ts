import { Prisma } from 'generated/prisma';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

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
  const startDate = dayjs.utc('2024-01-01').toISOString();
  const endDate = dayjs.utc('2025-01-01').toISOString();
  const trialEndDate = dayjs.utc('2024-01-15').toISOString();

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
