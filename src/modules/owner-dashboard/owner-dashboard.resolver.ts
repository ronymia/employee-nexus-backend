import { Resolver, Query } from '@nestjs/graphql';
import { OwnerDashboardService } from './owner-dashboard.service';
import {
  OwnerDashboard,
  OwnerDashboardResponse,
} from './entities/owner-dashboard.entity';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => OwnerDashboard)
// @UseGuards(PermissionsGuard)
export class OwnerDashboardResolver {
  constructor(private readonly ownerDashboardService: OwnerDashboardService) {}

  @Query(() => OwnerDashboardResponse, { name: 'ownerDashboard' })
  // @Permissions('dashboard.view')
  @UseGuards(GqlAuthGuard)
  async getOwnerDashboard(@CurrentUser() user: JwtPayload) {
    const result = await this.ownerDashboardService.getOwnerDashboard(
      user.businessId,
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Dashboard retrieved successfully`,
      data: result,
    };
  }
}
