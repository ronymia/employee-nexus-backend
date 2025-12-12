import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Profile, ProfileResponse } from './entities/profile.entity';
import { ProfilesService } from './profiles.service';
import { UpdateEmergencyContactInput } from './dto/update-emergency-contact.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UpdateEmploymentDetailsInput } from './dto/update-employment-details.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import {
  EmergencyContactResponse,
  EmploymentDetailsResponse,
} from './entities';

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  // UPDATE PROFILE
  @Mutation(() => ProfileResponse, { name: 'updateProfile' })
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ) {
    const result = await this.profilesService.updateProfile({
      updateProfileInput,
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
  @UseGuards(GqlAuthGuard)
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
  @UseGuards(GqlAuthGuard)
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
