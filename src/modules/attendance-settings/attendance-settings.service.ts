// ATTENDANCE SETTINGS SERVICE - PROVIDES BUSINESS LOGIC FOR ATTENDANCE SETTING CRUD OPERATIONS
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAttendanceSettingInput } from './dto/update-attendance-setting.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class AttendanceSettingsService {
  // PRISMA SERVICE INJECTION
  constructor(private readonly prisma: PrismaService) {}

  // FIND BY BUSINESS - GET ATTENDANCE SETTINGS FOR A SPECIFIC BUSINESS
  async findByBusiness({ user }: { user: JwtPayload }) {
    const result = await this.prisma.attendanceSettings.findUnique({
      where: { businessId: user.businessId },
      include: {
        business: true,
      },
    });

    if (!result) {
      throw new NotFoundException(
        `Attendance settings not found for business ${user.businessId}`,
      );
    }

    return result;
  }

  // UPDATE ATTENDANCE SETTING - MODIFIES AN EXISTING ATTENDANCE SETTING RECORD
  async update({
    user,
    updateAttendanceSettingInput,
  }: {
    user: JwtPayload;
    updateAttendanceSettingInput: UpdateAttendanceSettingInput;
  }) {
    // Update the attendance setting for the user's business
    return await this.prisma.attendanceSettings.update({
      where: { businessId: user.businessId },
      data: updateAttendanceSettingInput,
      include: {
        business: true,
      },
    });
  }
}
