/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  Notification,
  NotificationResponse,
  NotificationsQueryResponse,
  NotificationTemplateResponse,
  NotificationTemplatesQueryResponse,
  NotificationPreferenceResponse,
} from './entities';
import {
  CreateNotificationInput,
  CreateNotificationTemplateInput,
  UpdateNotificationTemplateInput,
  UpdateNotificationPreferenceInput,
  QueryNotificationInput,
} from './dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => Notification)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ============ NOTIFICATION OPERATIONS ============

  @Mutation(() => NotificationResponse)
  @RequirePermissions('Notification:create')
  async createNotification(
    @Args('createNotificationInput') input: CreateNotificationInput,
  ) {
    const notification = await this.notificationsService.create(input);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Notification created successfully',
      data: notification,
    };
  }

  @Query(() => NotificationsQueryResponse, { name: 'notifications' })
  @RequirePermissions('Notification:read')
  async notifications(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query?: QueryNotificationInput,
  ) {
    const result = await this.notificationsService.findAll(user, query);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Notifications retrieved successfully',
      ...result,
    };
  }

  @Query(() => NotificationResponse, { name: 'notificationById' })
  @RequirePermissions('Notification:read')
  async notification(@Args('id', { type: () => Int }) id: number) {
    const notification = await this.notificationsService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Notification retrieved successfully',
      data: notification,
    };
  }

  @Query(() => Int, { name: 'unreadNotificationCount' })
  @RequirePermissions('Notification:read')
  async unreadCount(@CurrentUser() user: JwtPayload): Promise<number> {
    return await this.notificationsService.getUnreadCount(user.userId);
  }

  @Mutation(() => NotificationResponse)
  @RequirePermissions('Notification:update')
  async markNotificationAsRead(@Args('id', { type: () => Int }) id: number) {
    const notification = await this.notificationsService.markAsRead(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Notification marked as read',
      data: notification,
    };
  }

  @Mutation(() => NotificationResponse)
  @RequirePermissions('Notification:update')
  async markAllNotificationsAsRead(@CurrentUser() user: JwtPayload) {
    const result = await this.notificationsService.markAllAsRead(user.userId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `${result?.count ?? ''} notifications marked as read`,
      data: null,
    };
  }

  @Mutation(() => NotificationResponse)
  @RequirePermissions('Notification:delete')
  async deleteNotification(@Args('id', { type: () => Int }) id: number) {
    const notification = await this.notificationsService.deleteNotification(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Notification deleted successfully',
      data: notification,
    };
  }

  // ============ NOTIFICATION TEMPLATE OPERATIONS ============

  @Mutation(() => NotificationTemplateResponse)
  @RequirePermissions('Notification Template:create')
  async createNotificationTemplate(
    @Args('createNotificationTemplateInput')
    input: CreateNotificationTemplateInput,
  ) {
    const template = await this.notificationsService.createTemplate(input);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Notification template created successfully',
      data: template,
    };
  }

  @Query(() => NotificationTemplatesQueryResponse, {
    name: 'notificationTemplates',
  })
  @RequirePermissions('Notification Template:read')
  async notificationTemplates(@CurrentUser() user: JwtPayload) {
    const templates = await this.notificationsService.findAllTemplates(
      user.businessId,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Notification templates retrieved successfully',
      data: templates,
    };
  }

  @Mutation(() => NotificationTemplateResponse)
  @RequirePermissions('Notification Template:update')
  async updateNotificationTemplate(
    @Args('updateNotificationTemplateInput')
    input: UpdateNotificationTemplateInput,
  ) {
    const template = await this.notificationsService.updateTemplate(input);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Notification template updated successfully',
      data: template,
    };
  }

  //   @Mutation(() => NotificationTemplateResponse)
  //   @RequirePermissions('Notification Template:delete')
  //   async deleteNotificationTemplate(
  //     @Args('id', { type: () => Int }) id: number,
  //   ) {
  //     const template = await this.notificationsService.deleteTemplate(id);
  //     return {
  //       success: true,
  //       statusCode: HttpStatus.OK,
  //       message: 'Notification template deleted successfully',
  //       data: template,
  //     };
  //   }

  // ============ NOTIFICATION PREFERENCE OPERATIONS ============

  @Query(() => NotificationPreferenceResponse, {
    name: 'notificationPreferences',
  })
  @RequirePermissions('Notification:read')
  async notificationPreferences(@CurrentUser() user: JwtPayload) {
    const preferences = await this.notificationsService.getPreferences(
      user.userId,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Notification preferences retrieved successfully',
      data: preferences,
    };
  }

  @Mutation(() => NotificationPreferenceResponse)
  @RequirePermissions('Notification:update')
  async updateNotificationPreferences(
    @CurrentUser() user: JwtPayload,
    @Args('updateNotificationPreferenceInput')
    input: UpdateNotificationPreferenceInput,
  ) {
    const preferences = await this.notificationsService.updatePreferences(
      user.userId,
      input,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Notification preferences updated successfully',
      data: preferences,
    };
  }
}
