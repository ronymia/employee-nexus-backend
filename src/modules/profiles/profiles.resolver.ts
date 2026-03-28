import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Profile, ProfileResponse } from './entities/profile.entity';
import { ProfilesService } from './profiles.service';
import { UpdateEmergencyContactInput } from './dto/update-emergency-contact.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UpdateEmploymentDetailsInput } from './dto/update-employment-details.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import {
  EmergencyContactResponse,
  EmploymentDetailsResponse,
} from './entities';

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  // UPDATE PROFILE
  @Mutation(() => ProfileResponse, { name: 'updateProfile' })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions('Profile:update')
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ) {
    // Override userId from JWT to prevent IDOR (client cannot spoof another user's profile)
    const result = await this.profilesService.updateProfile({
      updateProfileInput: { ...updateProfileInput, userId: user.userId },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Profile updated successfully',
      data: result,
    };
  }

  // UPDATE EMERGENCY CONTACT
  @Mutation(() => EmergencyContactResponse, {
    name: 'updateEmergencyContact',
  })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions('Emergency Contact:update')
  async updateEmergencyContact(
    @Args('updateEmergencyContactInput')
    updateEmergencyContactInput: UpdateEmergencyContactInput,
  ) {
    const result = await this.profilesService.updateEmergencyContact({
      updateEmergencyContactInput,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Emergency contact updated successfully',
      data: result,
    };
  }

  // UPDATE EMPLOYMENT DETAILS
  @Mutation(() => EmploymentDetailsResponse, {
    name: 'updateEmploymentDetails',
  })
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @RequirePermissions('Employment Details:update')
  async updateEmploymentDetails(
    @Args('updateEmploymentDetailsInput')
    updateEmploymentDetailsInput: UpdateEmploymentDetailsInput,
  ) {
    const result = await this.profilesService.updateEmploymentDetails({
      updateEmploymentDetailsInput,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employment details information updated successfully',
      data: result,
    };
  }
}
