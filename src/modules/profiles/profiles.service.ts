import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEmergencyContactInput } from './dto/update-emergency-contact.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UpdateEmploymentDetailsInput } from './dto/update-employment-details.input';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile({
    updateProfileInput,
  }: {
    updateProfileInput: UpdateProfileInput;
  }) {
    // Get user's profile
    const profile = await this.prisma.profile.findUnique({
      where: { id: updateProfileInput.id },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Update profile
    const updatedProfile = await this.prisma.profile.update({
      where: { id: profile.id },
      data: updateProfileInput,
      include: {
        emergencyContact: true,
      },
    });

    return updatedProfile;
  }

  async updateEmergencyContact({
    updateEmergencyContactInput,
  }: {
    updateEmergencyContactInput: UpdateEmergencyContactInput;
  }) {
    const { id: profileId, ...rest } = updateEmergencyContactInput;

    // Get user's profile
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Upsert emergency contact
    const emergencyContact = await this.prisma.emergencyContact.upsert({
      where: { profileId: profile.id },
      update: rest,
      create: {
        ...rest,
        profileId: profile.id,
      },
    });

    return emergencyContact;
  }

  async updateEmploymentDetails({
    updateEmploymentDetailsInput,
  }: {
    updateEmploymentDetailsInput: UpdateEmploymentDetailsInput;
  }) {
    const { id, ...updateData } = updateEmploymentDetailsInput;

    // Get employee by Id
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Convert joiningDate string to Date if provided
    const data: any = { ...updateData };
    // if (updateData.joiningDate) {
    //   data.joiningDate = new Date(updateData.joiningDate);
    // }

    // Update employee
    const updatedEmployee = await this.prisma.employee.update({
      where: { id: id },
      data,
    });

    return updatedEmployee;
  }
}
