// LEAVE SETTINGS SERVICE - PROVIDES BUSINESS LOGIC FOR LEAVE SETTING CRUD OPERATIONS
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateLeaveSettingInput } from './dto/update-leave-setting.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class LeaveSettingsService {
  // PRISMA SERVICE INJECTION
  constructor(private readonly prisma: PrismaService) {}

  // FIND BY BUSINESS - GET LEAVE SETTINGS FOR A SPECIFIC BUSINESS
  async findByBusiness({ user }: { user: JwtPayload }) {
    const result = await this.prisma.leaveSettings.findUnique({
      where: { businessId: user.businessId },
      include: {
        business: true,
      },
    });

    if (!result) {
      throw new NotFoundException(
        `Leave settings not found for business ${user.businessId}`,
      );
    }

    return result;
  }

  // UPDATE LEAVE SETTING - MODIFIES AN EXISTING LEAVE SETTING RECORD
  async update({
    user,
    updateLeaveSettingInput,
  }: {
    user: JwtPayload;
    updateLeaveSettingInput: UpdateLeaveSettingInput;
  }) {
    // Update the leave setting for the user's business
    return await this.prisma.leaveSettings.update({
      where: { businessId: user.businessId },
      data: updateLeaveSettingInput,
      include: {
        business: true,
      },
    });
  }
}
