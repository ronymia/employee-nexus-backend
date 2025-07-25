import { Module } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { RolePermissionsResolver } from './role-permissions.resolver';

@Module({
  providers: [RolePermissionsResolver, RolePermissionsService],
})
export class RolePermissionsModule {}
