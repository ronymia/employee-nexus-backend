import { PrismaClient } from 'generated/prisma';
import {
  NotificationChannel,
  NotificationPriority,
  NotificationType,
} from 'src/modules/notifications/enums';

const prisma = new PrismaClient();

export async function seedNotificationTemplates() {
  console.log('🔔 Seeding notification templates...');

  const templates = [
    // Leave Management Notifications
    {
      name: 'leave_requested',
      type: NotificationType.LEAVE,
      title: 'New Leave Request',
      message:
        '{{employeeName}} has requested {{leaveType}} leave from {{startDate}} to {{endDate}}.',
      priority: NotificationPriority.NORMAL,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      isActive: true,
      businessId: null, // Global template
    },
    {
      name: 'leave_approved',
      type: NotificationType.LEAVE,
      title: 'Leave Request Approved',
      message:
        'Your {{leaveType}} leave request from {{startDate}} to {{endDate}} has been approved by {{approverName}}.',
      priority: NotificationPriority.HIGH,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      isActive: true,
      businessId: null,
    },
    {
      name: 'leave_rejected',
      type: NotificationType.LEAVE,
      title: 'Leave Request Rejected',
      message:
        'Your {{leaveType}} leave request from {{startDate}} to {{endDate}} has been rejected. Reason: {{reason}}',
      priority: NotificationPriority.HIGH,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      isActive: true,
      businessId: null,
    },

    // Payroll Notifications
    {
      name: 'payslip_generated',
      type: NotificationType.PAYROLL,
      title: 'Payslip Available',
      message:
        'Your payslip for {{month}} {{year}} is now available. Net pay: {{netPay}}',
      priority: NotificationPriority.HIGH,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      isActive: true,
      businessId: null,
    },

    // Attendance Notifications
    {
      name: 'attendance_late',
      type: NotificationType.ATTENDANCE,
      title: 'Late Check-in Alert',
      message:
        'You checked in at {{checkInTime}} on {{date}}. Expected check-in time was {{expectedTime}}.',
      priority: NotificationPriority.NORMAL,
      channels: [NotificationChannel.IN_APP],
      isActive: true,
      businessId: null,
    },
    {
      name: 'attendance_absent',
      type: NotificationType.ATTENDANCE,
      title: 'Absence Alert',
      message:
        'You were marked absent on {{date}}. Please contact HR if this is incorrect.',
      priority: NotificationPriority.HIGH,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      isActive: true,
      businessId: null,
    },
    {
      name: 'attendance_reminder',
      type: NotificationType.ATTENDANCE,
      title: 'Check-out Reminder',
      message:
        'Remember to check out for the day. Your check-in time was {{checkInTime}}.',
      priority: NotificationPriority.LOW,
      channels: [NotificationChannel.IN_APP],
      isActive: true,
      businessId: null,
    },

    // Asset Management
    {
      name: 'asset_assigned',
      type: NotificationType.ASSET,
      title: 'Asset Assigned',
      message:
        '{{assetType}} - {{assetName}} has been assigned to you. Please confirm receipt.',
      priority: NotificationPriority.NORMAL,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      isActive: true,
      businessId: null,
    },

    // Project Management
    {
      name: 'project_assigned',
      type: NotificationType.PROJECT,
      title: 'Project Assignment',
      message:
        'You have been assigned to project: {{projectName}}. Role: {{role}}',
      priority: NotificationPriority.NORMAL,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      isActive: true,
      businessId: null,
    },

    // Holiday Announcements
    {
      name: 'holiday_announced',
      type: NotificationType.ANNOUNCEMENT,
      title: 'Holiday Announcement',
      message: 'Holiday on {{date}}: {{holidayName}}. {{description}}',
      priority: NotificationPriority.NORMAL,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      isActive: true,
      businessId: null,
    },

    // System Reminders
    {
      name: 'document_expiry_reminder',
      type: NotificationType.REMINDER,
      title: 'Document Expiry Reminder',
      message:
        'Your {{documentType}} will expire on {{expiryDate}}. Please renew it soon.',
      priority: NotificationPriority.HIGH,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      isActive: true,
      businessId: null,
    },
    {
      name: 'profile_incomplete',
      type: NotificationType.REMINDER,
      title: 'Complete Your Profile',
      message:
        'Your profile is {{completionPercentage}}% complete. Please update: {{missingFields}}',
      priority: NotificationPriority.LOW,
      channels: [NotificationChannel.IN_APP],
      isActive: true,
      businessId: null,
    },
  ];

  let createdCount = 0;
  let skippedCount = 0;

  for (const template of templates) {
    try {
      // Check if template already exists
      const existing = await prisma.notificationTemplate.findFirst({
        where: {
          name: template.name,
          businessId: null, // Global templates
        },
      });

      if (existing) {
        console.log(
          `⏭️  Template "${template.name}" already exists, skipping...`,
        );
        skippedCount++;
        continue;
      }

      await prisma.notificationTemplate.create({
        data: template,
      });
      console.log(`✅ Created template: ${template.name}`);
      createdCount++;
    } catch (error) {
      console.error(
        `❌ Failed to create template "${template.name}":`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error?.message,
      );
    }
  }

  console.log(`\n✨ Notification template seeding complete!`);
  console.log(`   Created: ${createdCount} templates`);
  console.log(`   Skipped: ${skippedCount} templates (already exist)`);
  console.log(`   Total: ${templates.length} templates\n`);
}
