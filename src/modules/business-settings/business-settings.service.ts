// BUSINESS SETTINGS SERVICE - PROVIDES BUSINESS LOGIC FOR BUSINESS SETTING CRUD OPERATIONS
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBusinessSettingInput } from './dto/update-business-setting.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class BusinessSettingsService {
  // PRISMA SERVICE INJECTION
  constructor(private readonly prisma: PrismaService) {}

  // FIND BY BUSINESS - GET BUSINESS SETTINGS FOR A SPECIFIC BUSINESS
  async findByBusiness({ user }: { user: JwtPayload }) {
    const result = await this.prisma.businessSettings.findUnique({
      where: { businessId: user.businessId },
      include: {
        business: true,
      },
    });

    if (!result) {
      throw new NotFoundException(
        `Business settings not found for business ${user.businessId}`,
      );
    }

    return result;
  }

  // UPDATE BUSINESS SETTING - MODIFIES AN EXISTING BUSINESS SETTING RECORD
  async update({
    user,
    updateBusinessSettingInput,
  }: {
    user: JwtPayload;
    updateBusinessSettingInput: UpdateBusinessSettingInput;
  }) {
    // Update the business setting for the user's business
    return await this.prisma.businessSettings.update({
      where: { businessId: user.businessId },
      data: {
        ...updateBusinessSettingInput,
        businessId: user.businessId,
        deleteReadNotifications: 30,
      },
      include: {
        business: true,
      },
    });
  }
}
