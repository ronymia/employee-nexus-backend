import { Injectable } from '@nestjs/common';
import { BusinessSubscriptionStatus } from 'generated/prisma';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

@Injectable()
export class SubscriptionStatusHelper {
  /**
   * Automatically determine subscription status based on dates
   */
  static calculateStatus(data: {
    trialEndDate?: Date | null;
    startDate: Date;
    endDate?: Date | null;
    status?: string;
  }): { status: BusinessSubscriptionStatus; isActive: boolean } {
    const now = dayjs.utc().toDate();
    now.setHours(0, 0, 0, 0); // Start of day

    // If manually cancelled or suspended, keep that status
    if (
      data.status === BusinessSubscriptionStatus.CANCELLED ||
      data.status === BusinessSubscriptionStatus.SUSPENDED
    ) {
      return {
        status: data.status,
        isActive: false,
      };
    }

    // Check if in trial period
    if (data.trialEndDate) {
      const trialEnd = dayjs.utc(data.trialEndDate).toDate();
      trialEnd.setHours(0, 0, 0, 0);

      if (now <= trialEnd) {
        return { status: BusinessSubscriptionStatus.TRIAL, isActive: true };
      }
    }

    // Check start date
    const startDate = dayjs.utc(data.startDate).toDate();
    startDate.setHours(0, 0, 0, 0);

    if (now < startDate) {
      return { status: BusinessSubscriptionStatus.PENDING, isActive: false };
    }

    // Check end date
    if (data.endDate) {
      const endDate = dayjs.utc(data.endDate).toDate();
      endDate.setHours(0, 0, 0, 0);

      if (now > endDate) {
        return { status: BusinessSubscriptionStatus.EXPIRED, isActive: false };
      }
    }

    // Active subscription
    return { status: BusinessSubscriptionStatus.ACTIVE, isActive: true };
  }

  /**
   * Check if subscription allows certain features
   */
  static canAccessFeature(
    status: string,
    isActive: boolean,
    // _featureName?: string,
  ): boolean {
    // During trial, all features are accessible
    if (status === BusinessSubscriptionStatus.TRIAL && isActive) {
      return true;
    }

    // Active subscriptions have full access
    if (status === BusinessSubscriptionStatus.ACTIVE && isActive) {
      return true;
    }

    // All other statuses have no access
    return false;
  }

  /**
   * Get user-friendly status message
   */
  static getStatusMessage(status: string, endDate?: Date | null): string {
    switch (status) {
      case BusinessSubscriptionStatus.TRIAL: {
        const daysLeft = endDate
          ? Math.ceil(
              (dayjs.utc(endDate).toDate().getTime() -
                dayjs.utc().toDate().getTime()) /
                (1000 * 60 * 60 * 24),
            )
          : 0;
        return `Trial period (${daysLeft} days remaining)`;
      }

      case BusinessSubscriptionStatus.ACTIVE:
        return 'Active subscription';

      case BusinessSubscriptionStatus.EXPIRED:
        return 'Subscription expired';

      case BusinessSubscriptionStatus.CANCELLED:
        return 'Subscription cancelled';

      case BusinessSubscriptionStatus.SUSPENDED:
        return 'Subscription suspended';

      case BusinessSubscriptionStatus.PENDING:
        return 'Pending activation';

      default:
        return 'Unknown status';
    }
  }

  /**
   * Validate status transition
   */
  static canTransitionTo(
    currentStatus: string,
    newStatus: string,
  ): { allowed: boolean; reason?: string } {
    const validTransitions: Record<string, string[]> = {
      [BusinessSubscriptionStatus.PENDING]: [
        BusinessSubscriptionStatus.TRIAL,
        BusinessSubscriptionStatus.ACTIVE,
        BusinessSubscriptionStatus.CANCELLED,
      ],
      [BusinessSubscriptionStatus.TRIAL]: [
        BusinessSubscriptionStatus.ACTIVE,
        BusinessSubscriptionStatus.EXPIRED,
        BusinessSubscriptionStatus.CANCELLED,
      ],
      [BusinessSubscriptionStatus.ACTIVE]: [
        BusinessSubscriptionStatus.EXPIRED,
        BusinessSubscriptionStatus.CANCELLED,
        BusinessSubscriptionStatus.SUSPENDED,
      ],
      [BusinessSubscriptionStatus.SUSPENDED]: [
        BusinessSubscriptionStatus.ACTIVE,
        BusinessSubscriptionStatus.CANCELLED,
        BusinessSubscriptionStatus.EXPIRED,
      ],
      [BusinessSubscriptionStatus.EXPIRED]: [
        BusinessSubscriptionStatus.ACTIVE, // Renewal
        BusinessSubscriptionStatus.CANCELLED,
      ],
      [BusinessSubscriptionStatus.CANCELLED]: [], // Final state
    };

    const allowed = validTransitions[currentStatus]?.includes(newStatus);

    if (!allowed) {
      return {
        allowed: false,
        reason: `Cannot transition from ${currentStatus} to ${newStatus}`,
      };
    }

    return { allowed: true };
  }
}
