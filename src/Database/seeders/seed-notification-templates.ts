/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Prisma } from 'generated/prisma';
import {
  NotificationPriority,
  NotificationType,
} from 'src/modules/notifications/enums';

/**
 * Seeds notification templates for a business
 */
export async function seedNotificationTemplates(
  tx: Prisma.TransactionClient,
  businessId: number,
) {
  console.log('\n🔔 Seeding notification templates...');

  const templates = [
    // Leave Management Notifications
    {
      name: 'leave_requested',
      type: NotificationType.LEAVE,
      title: 'New Leave Request',
      message:
        '{{employeeName}} has requested {{leaveType}} leave from {{startDate}} to {{endDate}}.',
      priority: NotificationPriority.NORMAL,
      businessId,
    },
    {
      name: 'leave_approved',
      type: NotificationType.LEAVE,
      title: 'Leave Request Approved',
      message:
        'Your {{leaveType}} leave request from {{startDate}} to {{endDate}} has been approved by {{approverName}}.',
      priority: NotificationPriority.HIGH,
      businessId,
    },
    {
      name: 'leave_rejected',
      type: NotificationType.LEAVE,
      title: 'Leave Request Rejected',
      message:
        'Your {{leaveType}} leave request from {{startDate}} to {{endDate}} has been rejected. Reason: {{reason}}',
      priority: NotificationPriority.HIGH,
      businessId,
    },

    // Payroll Notifications
    {
      name: 'payslip_generated',
      type: NotificationType.PAYROLL,
      title: 'Payslip Available',
      message:
        'Your payslip for {{month}} {{year}} is now available. Net pay: {{netPay}}',
      priority: NotificationPriority.HIGH,
      businessId,
    },

    // Attendance Notifications
    {
      name: 'attendance_requested',
      type: NotificationType.ATTENDANCE,
      title: 'New Attendance Record',
      message:
        '{{employeeName}} created an attendance record for {{date}} with {{workTime}} work time.',
      priority: NotificationPriority.NORMAL,
      isActive: true,
      businessId,
    },
    {
      name: 'attendance_created',
      type: NotificationType.ATTENDANCE,
      title: 'New Attendance Record',
      message:
        '{{employeeName}} created an attendance record for {{date}} with {{workTime}} work time.',
      priority: NotificationPriority.NORMAL,
      businessId,
    },
    {
      name: 'attendance_updated',
      type: NotificationType.ATTENDANCE,
      title: 'Attendance Record Updated',
      message:
        '{{employeeName}} updated attendance record for {{date}}. Total work time: {{workTime}}.',
      priority: NotificationPriority.NORMAL,
      businessId,
    },
    {
      name: 'attendance_deleted',
      type: NotificationType.ATTENDANCE,
      title: 'Attendance Record Deleted',
      message: '{{employeeName}} deleted attendance record for {{date}}.',
      priority: NotificationPriority.HIGH,
      businessId,
    },
    {
      name: 'attendance_punch_in',
      type: NotificationType.ATTENDANCE,
      title: 'Employee Punched In',
      message: '{{employeeName}} punched in at {{checkInTime}} on {{date}}.',
      priority: NotificationPriority.LOW,
      businessId,
    },
    {
      name: 'attendance_punch_out',
      type: NotificationType.ATTENDANCE,
      title: 'Employee Punched Out',
      message:
        '{{employeeName}} punched out at {{checkOutTime}}. Total work time: {{workTime}}.',
      priority: NotificationPriority.LOW,
      businessId,
    },
    {
      name: 'attendance_late',
      type: NotificationType.ATTENDANCE,
      title: 'Late Check-in Alert',
      message:
        'You checked in at {{checkInTime}} on {{date}}. Expected check-in time was {{expectedTime}}.',
      priority: NotificationPriority.NORMAL,
      businessId,
    },
    {
      name: 'attendance_absent',
      type: NotificationType.ATTENDANCE,
      title: 'Absence Alert',
      message:
        'You were marked absent on {{date}}. Please contact HR if this is incorrect.',
      priority: NotificationPriority.HIGH,
      businessId,
    },
    {
      name: 'attendance_reminder',
      type: NotificationType.ATTENDANCE,
      title: 'Check-out Reminder',
      message:
        'Remember to check out for the day. Your check-in time was {{checkInTime}}.',
      priority: NotificationPriority.LOW,
      businessId,
    },

    // Asset Management
    {
      name: 'asset_assigned',
      type: NotificationType.ASSET,
      title: 'Asset Assigned',
      message:
        '{{assetType}} - {{assetName}} has been assigned to you. Please confirm receipt.',
      priority: NotificationPriority.NORMAL,
      businessId,
    },

    // Project Management
    {
      name: 'project_assigned',
      type: NotificationType.PROJECT,
      title: 'Project Assignment',
      message:
        'You have been assigned to project: {{projectName}}. Role: {{role}}',
      priority: NotificationPriority.NORMAL,
      businessId,
    },

    // Holiday Announcements
    {
      name: 'holiday_announced',
      type: NotificationType.ANNOUNCEMENT,
      title: 'Holiday Announcement',
      message: 'Holiday on {{date}}: {{holidayName}}. {{description}}',
      priority: NotificationPriority.NORMAL,
      businessId,
    },

    // System Reminders
    {
      name: 'document_expiry_reminder',
      type: NotificationType.REMINDER,
      title: 'Document Expiry Reminder',
      message:
        'Your {{documentType}} will expire on {{expiryDate}}. Please renew it soon.',
      priority: NotificationPriority.HIGH,
      businessId,
    },
    {
      name: 'profile_incomplete',
      type: NotificationType.REMINDER,
      title: 'Complete Your Profile',
      message:
        'Your profile is {{completionPercentage}}% complete. Please update: {{missingFields}}',
      priority: NotificationPriority.LOW,
      businessId,
    },
  ];

  const createdTemplates: any[] = [];

  for (const template of templates) {
    const created = await tx.notificationTemplate.create({
      data: template,
    });
    createdTemplates.push(created);
  }

  console.log(`✅ Created ${createdTemplates.length} notification templates:`);
  console.log(`   - Leave notifications: 3`);
  console.log(`   - Payroll notifications: 1`);
  console.log(`   - Attendance notifications: 9`);
  console.log(`   - Asset notifications: 1`);
  console.log(`   - Project notifications: 1`);
  console.log(`   - Announcements: 1`);
  console.log(`   - Reminders: 2`);

  return createdTemplates;
}
