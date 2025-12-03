import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateNotificationInput,
  CreateNotificationTemplateInput,
  UpdateNotificationTemplateInput,
  UpdateNotificationPreferenceInput,
  QueryNotificationInput,
} from './dto';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // ============ NOTIFICATION OPERATIONS ============

  async create(input: CreateNotificationInput) {
    const { metadata, ...data } = input;
    return await this.prisma.notification.create({
      data: {
        ...data,
        metadata: metadata ? JSON.parse(metadata) : undefined,
      },
    });
  }

  async findAll(user: JwtPayload, query?: QueryNotificationInput) {
    const {
      page = 1,
      limit = 20,
      userId,
      isRead,
      type,
      businessId,
    } = query || {};
    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by userId (default to current user if not super admin)
    if (userId) {
      where.userId = userId;
    } else if (user.businessId) {
      where.userId = user.id;
    }

    if (typeof isRead === 'boolean') {
      where.isRead = isRead;
    }

    if (type) {
      where.type = type;
    }

    if (businessId) {
      where.businessId = businessId;
    }

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: data.map((n) => ({
        ...n,
        metadata: n.metadata ? JSON.stringify(n.metadata) : null,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return {
      ...notification,
      metadata: notification.metadata
        ? JSON.stringify(notification.metadata)
        : null,
    };
  }

  async markAsRead(id: number) {
    return await this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: number) {
    return await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async deleteNotification(id: number) {
    return await this.prisma.notification.delete({
      where: { id },
    });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  // ============ NOTIFICATION TEMPLATE OPERATIONS ============

  async createTemplate(input: CreateNotificationTemplateInput) {
    return await this.prisma.notificationTemplate.create({
      data: input,
    });
  }

  async findAllTemplates(businessId?: number) {
    const where: any = {};
    if (businessId) {
      where.OR = [
        { businessId },
        { businessId: null }, // Include global templates
      ];
    } else {
      where.businessId = null; // Only global templates
    }

    return await this.prisma.notificationTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findTemplateByName(name: string, businessId?: number) {
    return await this.prisma.notificationTemplate.findFirst({
      where: {
        name,
        OR: [{ businessId }, { businessId: null }],
        isActive: true,
      },
    });
  }

  async updateTemplate(input: UpdateNotificationTemplateInput) {
    const { id, ...data } = input;
    return await this.prisma.notificationTemplate.update({
      where: { id },
      data,
    });
  }

  async deleteTemplate(id: number) {
    return await this.prisma.notificationTemplate.delete({
      where: { id },
    });
  }

  // ============ NOTIFICATION PREFERENCE OPERATIONS ============

  async getPreferences(userId: number) {
    const preference = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!preference) {
      // Return default preferences
      return {
        userId,
        preferences: JSON.stringify(this.getDefaultPreferences()),
        muteAll: false,
        mutedUntil: null,
      };
    }

    return {
      ...preference,
      preferences: JSON.stringify(preference.preferences),
    };
  }

  async updatePreferences(
    userId: number,
    input: UpdateNotificationPreferenceInput,
  ) {
    const { preferences, ...data } = input;

    const updateData: any = { ...data };
    if (preferences) {
      updateData.preferences = JSON.parse(preferences);
    }

    return await this.prisma.notificationPreference.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
        preferences: updateData.preferences || this.getDefaultPreferences(),
      },
    });
  }

  // ============ HELPER METHODS ============

  private getDefaultPreferences() {
    return {
      LEAVE: ['IN_APP', 'EMAIL'],
      PAYROLL: ['IN_APP', 'EMAIL'],
      ATTENDANCE: ['IN_APP'],
      ASSET: ['IN_APP', 'EMAIL'],
      PROJECT: ['IN_APP'],
      DOCUMENT: ['IN_APP'],
      HOLIDAY: ['IN_APP'],
      SCHEDULE: ['IN_APP'],
      ANNOUNCEMENT: ['IN_APP'],
      SYSTEM: ['IN_APP', 'EMAIL'],
    };
  }

  // Helper to render template with variables
  renderTemplate(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  }

  // Send notification using template
  async sendFromTemplate(
    templateName: string,
    userId: number,
    variables: Record<string, any>,
    businessId?: number,
  ) {
    const template = await this.findTemplateByName(templateName, businessId);

    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    const title = this.renderTemplate(template.title, variables);
    const message = this.renderTemplate(template.message, variables);

    return await this.create({
      type: template.type,
      title,
      message,
      priority: template.priority,
      notificationTemplateId: template.id,
      channels: template.channels,
      userId,
      businessId,
      metadata: JSON.stringify(variables),
      ...variables, // Include entityType, entityId, actionUrl if present
    });
  }
}
