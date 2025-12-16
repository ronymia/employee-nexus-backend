import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEmergencyContactInput } from './dto/update-emergency-contact.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UpdateEmploymentDetailsInput } from './dto/update-employment-details.input';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  // UPDATE PROFILE
  async updateProfile({
    updateProfileInput,
  }: {
    updateProfileInput: UpdateProfileInput;
  }) {
    // Get user's profile
    const profile = await this.prisma.profile.findUnique({
      where: { userId: updateProfileInput.userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Update profile
    const updatedProfile = await this.prisma.profile.update({
      where: { userId: profile.userId },
      data: updateProfileInput,
      include: {
        emergencyContact: true,
        socialLinks: true,
      },
    });

    return updatedProfile;
  }

  // UPDATE EMERGENCY CONTACT
  async updateEmergencyContact({
    updateEmergencyContactInput,
  }: {
    updateEmergencyContactInput: UpdateEmergencyContactInput;
  }) {
    const { userId, ...rest } = updateEmergencyContactInput;

    // Get user's profile
    const profile = await this.prisma.profile.findUnique({
      where: { userId: userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Upsert emergency contact
    const emergencyContact = await this.prisma.emergencyContact.upsert({
      where: { userId: profile.userId },
      update: rest,
      create: updateEmergencyContactInput,
    });

    return emergencyContact;
  }

  // UPDATE EMPLOYMENT DETAILS
  async updateEmploymentDetails({
    updateEmploymentDetailsInput,
  }: {
    updateEmploymentDetailsInput: UpdateEmploymentDetailsInput;
  }) {
    const { userId, ...rest } = updateEmploymentDetailsInput;

    // Get employee by Id
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Update employee
    const updatedEmployee = await this.prisma.employee.update({
      where: { userId: userId },
      data: rest,
    });

    return updatedEmployee;
  }
}
