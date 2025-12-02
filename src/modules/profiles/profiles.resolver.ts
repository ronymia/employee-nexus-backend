import { Resolver, Mutation, Args } from '@nestjs/graphql';
import {
  EmergencyContactResponse,
  Profile,
  ProfileResponse,
} from './entities/profile.entity';
import { ProfilesService } from './profiles.service';
import { UpdateEmergencyContactInput } from './dto/update-emergency-contact.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UpdateEmploymentDetailsInput } from './dto/update-employment-details.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Employee } from '../users/entities/employee.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class EmployeeResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => Int)
  statusCode: number;

  @Field(() => String)
  message: string;

  @Field(() => Employee)
  data: Employee;
}

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

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

  @Mutation(() => EmployeeResponse, { name: 'updateEmploymentDetails' })
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
      message: 'Employee information updated successfully',
      data: result,
    };
  }
}
