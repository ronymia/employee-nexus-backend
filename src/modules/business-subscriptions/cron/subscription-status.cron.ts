import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { SubscriptionStatusHelper } from '../helpers/subscription-status.helper';
import { BusinessSubscriptionStatus } from 'src/modules/subscription-plans/enums';

/**
 * Cron job to automatically update subscription statuses based on dates
 * Runs daily at midnight to check and update expired, pending, or transitioning subscriptions
 */
@Injectable()
export class SubscriptionStatusCron {
  private readonly logger = new Logger(SubscriptionStatusCron.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Daily job to update subscription statuses
   * - Checks all subscriptions that might need status updates
   * - Recalculates status based on current date and subscription dates
   * - Updates status and isActive fields if changed
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateSubscriptionStatuses(): Promise<void> {
    this.logger.log('Starting subscription status update cron job');

    try {
      // Fetch all subscriptions (excluding permanently cancelled ones)
      const subscriptions = await this.prisma.businessSubscription.findMany({
        where: {
          status: {
            not: BusinessSubscriptionStatus.CANCELLED, // Don't recalculate cancelled subscriptions
          },
        },
        select: {
          id: true,
          status: true,
          trialEndDate: true,
          startDate: true,
          endDate: true,
          businessId: true,
        },
      });

      this.logger.log(`Found ${subscriptions.length} subscriptions to check`);

      let updatedCount = 0;

      // Process each subscription
      for (const subscription of subscriptions) {
        const { status: calculatedStatus, isActive: calculatedIsActive } =
          SubscriptionStatusHelper.calculateStatus({
            status: subscription.status,
            trialEndDate: subscription.trialEndDate,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
          });

        // Update if status or isActive has changed
        if (subscription.status !== calculatedStatus) {
          await this.prisma.businessSubscription.update({
            where: { id: subscription.id },
            data: {
              status: calculatedStatus,
            },
          });

          updatedCount++;

          this.logger.log(
            `Updated subscription ${subscription.id} for business ${subscription.businessId}: ` +
              `${subscription.status} → ${calculatedStatus}, `,
          );
        }
      }

      this.logger.log(
        `Subscription status update completed. Updated ${updatedCount} out of ${subscriptions.length} subscriptions`,
      );
    } catch (error) {
      this.logger.error(
        'Error updating subscription statuses',
        error.stack || error,
      );
      throw error;
    }
  }

  /**
   * Manual trigger for testing or administrative purposes
   * Can be called from a controller/resolver if needed
   */
  async triggerManualUpdate(): Promise<{ updated: number; total: number }> {
    this.logger.log('Manual subscription status update triggered');

    const subscriptions = await this.prisma.businessSubscription.findMany({
      where: {
        status: { not: BusinessSubscriptionStatus.CANCELLED },
      },
    });

    let updatedCount = 0;

    for (const subscription of subscriptions) {
      const { status: calculatedStatus, isActive: calculatedIsActive } =
        SubscriptionStatusHelper.calculateStatus({
          status: subscription.status,
          trialEndDate: subscription.trialEndDate,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
        });

      if (subscription.status !== calculatedStatus) {
        await this.prisma.businessSubscription.update({
          where: { id: subscription.id },
          data: {
            status: calculatedStatus,
          },
        });
        updatedCount++;
      }
    }

    return {
      updated: updatedCount,
      total: subscriptions.length,
    };
  }
}
