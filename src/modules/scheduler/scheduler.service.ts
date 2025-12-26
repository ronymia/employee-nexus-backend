import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cron job that runs every day at midnight (00:00)
   * Updates employee schedule assignments based on startDate
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateActiveScheduleAssignments() {
    this.logger.log('Starting daily schedule assignment update...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day

      // Get all users who have schedule assignments
      const usersWithAssignments =
        await this.prisma.employeeScheduleAssignment.findMany({
          select: {
            userId: true,
          },
          distinct: ['userId'],
        });

      let totalUpdated = 0;

      for (const { userId } of usersWithAssignments) {
        // Get all assignments for this user
        const assignments =
          await this.prisma.employeeScheduleAssignment.findMany({
            where: { userId },
            orderBy: { startDate: 'desc' }, // Most recent first
          });

        // Find assignments that should be active (startDate <= today)
        const eligibleAssignments = assignments.filter(
          (assignment) => assignment.startDate <= today,
        );

        if (eligibleAssignments.length > 0) {
          // The most recent eligible assignment should be active
          const activeAssignment = eligibleAssignments[0];

          // Update all assignments for this user
          await this.prisma.employeeScheduleAssignment.updateMany({
            where: { userId },
            data: { isActive: false },
          });

          // Set the active one
          await this.prisma.employeeScheduleAssignment.update({
            where: { id: activeAssignment.id },
            data: { isActive: true },
          });

          totalUpdated++;
          this.logger.log(
            `Updated user ${userId}: Set assignment ${activeAssignment.id} as active`,
          );
        } else {
          // No eligible assignments, ensure all are inactive
          await this.prisma.employeeScheduleAssignment.updateMany({
            where: { userId },
            data: { isActive: false },
          });
        }
      }

      this.logger.log(
        `Completed schedule assignment update. Updated ${totalUpdated} users.`,
      );
    } catch (error) {
      this.logger.error('Error updating schedule assignments:', error);
    }
  }
}
