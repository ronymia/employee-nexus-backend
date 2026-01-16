// BUSINESS SETTINGS SERVICE - PROVIDES BUSINESS LOGIC FOR BUSINESS SETTING CRUD OPERATIONS
import { Injectable } from '@nestjs/common';
import { UpdateBusinessSettingInput } from './dto/update-business-setting.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessSettingsService {
  // PRISMA SERVICE INJECTION
  constructor(private readonly prisma: PrismaService) {}

  // FIND BY BUSINESS - GET BUSINESS SETTINGS FOR A SPECIFIC BUSINESS
  async findByBusiness({ businessId }: { businessId: number }) {
    const result = await this.prisma.businessSettings.findUniqueOrThrow({
      where: { businessId: businessId },
      include: {
        business: true,
      },
    });

    return result;
  }

  // UPDATE BUSINESS SETTING - MODIFIES AN EXISTING BUSINESS SETTING RECORD
  async update({
    businessId,
    updateBusinessSettingInput,
  }: {
    businessId: number;
    updateBusinessSettingInput: UpdateBusinessSettingInput;
  }) {
    // Update the business setting for the user's business
    return await this.prisma.businessSettings.update({
      where: { businessId: businessId },
      data: {
        ...updateBusinessSettingInput,
        businessId: businessId,
        deleteReadNotifications: 30,
      },
      include: {
        business: true,
      },
    });
  }
}
