/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateNotificationInput,
  CreateNotificationTemplateInput,
  UpdateNotificationTemplateInput,
  QueryNotificationInput,
} from './dto';
import { JwtPayload } from '../auth/jwt.strategy';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // ============ NOTIFICATION OPERATIONS ============

  async create(user: JwtPayload, input: CreateNotificationInput) {
    const { metadata, ...data } = input;
    return await this.prisma.notification.create({
      data: {
        ...data,
        priority: input?.priority || 'NORMAL',
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        businessId: user.businessId,
      },
    });
  }

  async findAll(user: JwtPayload, query?: QueryNotificationInput) {
    const { isRead, type } = query || {};

    // Always scope to the current user's own notifications.
    // Admins/managers can optionally filter by a specific userId within their business.
    const where: any = {
      userId: user.userId,
      businessId: user.businessId,
    };

    if (typeof isRead === 'boolean') {
      where.isRead = isRead;
    }

    if (type) {
      where.type = type;
    }

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: data,
      meta: {
        total,
        page: 0,
        limit: 0,
        totalPages: Math.ceil(total / 1),
      },
    };
  }

  async findOne(id: number, userId: number) {
    const notification = await this.prisma.notification.findUniqueOrThrow({
      where: { id, userId },
    });

    return notification;
  }

  async markAsRead(id: number, userId: number) {
    return await this.prisma.notification.update({
      where: { id, userId },
      data: {
        readAt: dayjs.utc().toISOString(),
      },
    });
  }

  async markAllAsRead(userId: number) {
    return await this.prisma.notification.updateMany({
      where: {
        userId,
        readAt: {
          not: null,
        },
      },
      data: {
        readAt: dayjs.utc().toISOString(),
      },
    });
  }

  async deleteNotification(id: number, userId: number) {
    return await this.prisma.notification.delete({
      where: { id, userId },
    });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await this.prisma.notification.count({
      where: { userId, readAt: null },
    });
  }

  // ============ NOTIFICATION TEMPLATE OPERATIONS ============

  async createTemplate(input: CreateNotificationTemplateInput) {
    return await this.prisma.notificationTemplate.create({
      data: { ...input, priority: input?.priority || 'NORMAL' },
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
        OR: [{ businessId }],
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

    // Extract only valid Notification fields from variables
    const { entityType, entityId, metaData = '' } = variables;

    return await this.create(
      { userId, businessId } as JwtPayload,
      {
        type: template.type,
        title,
        message,
        priority: template.priority,
        notificationTemplateId: template.id,
        userId,
        businessId,
        metadata: JSON.stringify(metaData),
        entityId: entityId ? Number(entityId) : undefined,
        entityType: entityType ? entityType : undefined,
      } as CreateNotificationInput,
    );
  }

  /**
   * Find manager or owner to notify
   */
  public async findNotificationRecipient(
    userId: number,
    businessId: number,
  ): Promise<number | null> {
    // Get user's primary department
    const userDepartment = await this.prisma.employeeDepartment.findFirst({
      where: {
        userId,
        isActive: true,
        isPrimary: true,
      },
      include: {
        department: {
          include: {
            manager: true,
          },
        },
      },
    });

    // If department has a manager, return manager's ID
    // if (userDepartment?.department?.managerId) {
    //   return userDepartment.department.managerId;
    // }

    // Otherwise, find business owner
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { ownerId: true },
    });

    return business?.ownerId || null;
  }
}
