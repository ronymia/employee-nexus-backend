import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SocialLinksService } from './social-links.service';
import {
  SocialLink,
  SocialLinkResponse,
  SocialLinksQueryResponse,
} from './entities/social-link.entity';
import { CreateSocialLinkInput } from './dto/create-social-link.input';
import { UpdateSocialLinkInput } from './dto/update-social-link.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QuerySocialLinkInput } from './dto/query-social-link.input';

@Resolver(() => SocialLink)
export class SocialLinksResolver {
  constructor(private readonly socialLinksService: SocialLinksService) {}

  // CREATE SOCIAL LINK
  @Mutation(() => SocialLinkResponse, { name: 'createSocialLink' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Social Link:create')
  @UseGuards(GqlAuthGuard)
  async createSocialLink(
    @Args('createSocialLinkInput') createSocialLinkInput: CreateSocialLinkInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.socialLinksService.create({
      user,
      createSocialLinkInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Social links created successfully`,
      data: result,
    };
  }

  // FIND ALL SOCIAL LINKS
  @Query(() => SocialLinksQueryResponse, { name: 'socialLinks' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Social Link:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QuerySocialLinkInput,
  ) {
    const result = await this.socialLinksService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Social links retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE SOCIAL LINK BY PROFILE ID
  @Query(() => SocialLinkResponse, { name: 'socialLinkByProfileId' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Social Link:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('profileId', { type: () => Int }) profileId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.socialLinksService.findOne({ user, profileId });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Social links retrieved successfully`,
      data: result,
    };
  }

  // UPDATE SOCIAL LINK
  @Mutation(() => SocialLinkResponse, { name: 'updateSocialLink' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Social Link:update')
  @UseGuards(GqlAuthGuard)
  async updateSocialLink(
    @CurrentUser() user: JwtPayload,
    @Args('updateSocialLinkInput') updateSocialLinkInput: UpdateSocialLinkInput,
  ) {
    const result = await this.socialLinksService.update({
      user,
      profileId: parseInt(updateSocialLinkInput.profileId),
      updateSocialLinkInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Social links updated successfully`,
      data: result,
    };
  }

  // REMOVE SOCIAL LINK
  @Mutation(() => SocialLinkResponse, { name: 'deleteSocialLink' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Social Link:delete')
  @UseGuards(GqlAuthGuard)
  async removeSocialLink(
    @Args('profileId', { type: () => Int }) profileId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.socialLinksService.remove({ user, profileId });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Social links deleted successfully`,
      data: result,
    };
  }
}
