import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SocialLinksService } from './social-links.service';
import { SocialLink, SocialLinkResponse } from './entities/social-link.entity';
import { CreateSocialLinkInput } from './dto/create-social-link.input';
import { UpdateSocialLinkInput } from './dto/update-social-link.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => SocialLink)
export class SocialLinksResolver {
  constructor(private readonly socialLinksService: SocialLinksService) {}

  // CREATE SOCIAL LINK
  @Mutation(() => SocialLinkResponse, { name: 'createSocialLink' })
  // @UseGuards(PermissionsGuard)
  // @UseGuards(GqlAuthGuard)
  @RequirePermissions('Social Link:create')
  async createSocialLink(
    @Args('createSocialLinkInput') createSocialLinkInput: CreateSocialLinkInput,
  ) {
    const result = await this.socialLinksService.create({
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
  @Query(() => SocialLinkResponse, { name: 'socialLinksByProfileId' })
  // @UseGuards(PermissionsGuard)
  // @RequirePermissions('Social Link:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('profileId', { type: () => Int, nullable: true }) profileId?: number,
  ) {
    const result = await this.socialLinksService.findAll({ profileId });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Social links retrieved successfully`,
      data: result || {},
    };
  }

  // FIND ONE SOCIAL LINK BY PROFILE ID
  @Query(() => SocialLinkResponse, { name: 'socialLink' })
  // @UseGuards(PermissionsGuard)
  // @RequirePermissions('Social Link:read')
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('userId', { type: () => Int }) userId: number) {
    const result = await this.socialLinksService.findOne({ userId });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Social links retrieved successfully`,
      data: result,
    };
  }

  // UPDATE SOCIAL LINK
  @Mutation(() => SocialLinkResponse, { name: 'updateSocialLink' })
  // @UseGuards(PermissionsGuard)
  // @RequirePermissions('Social Link:update')
  @UseGuards(GqlAuthGuard)
  async updateSocialLink(
    @Args('updateSocialLinkInput') updateSocialLinkInput: UpdateSocialLinkInput,
  ) {
    const result = await this.socialLinksService.update({
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
  // @UseGuards(PermissionsGuard)
  // @RequirePermissions('Social Link:delete')
  @UseGuards(GqlAuthGuard)
  async removeSocialLink(@Args('userId', { type: () => Int }) userId: number) {
    const result = await this.socialLinksService.remove({ userId });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Social links deleted successfully`,
      data: result,
    };
  }
}
