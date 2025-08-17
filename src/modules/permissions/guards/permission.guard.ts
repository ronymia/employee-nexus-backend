// permission.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { JwtPayload } from 'src/modules/auth/jwt.strategy';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // no permission required
    }

    const ctx = GqlExecutionContext.create(context);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = ctx.getContext()?.req?.user as JwtPayload;

    // console.log('from permission.guard.ts', { user, requiredPermissions });

    if (!user) throw new ForbiddenException('User not authenticated');

    // 1. get permission
    const permission = await this.prisma.permission.findFirst({
      where: {
        resource: requiredPermissions[0].split(':')[0],
        action: requiredPermissions[0].split(':')[1],
      },
    });

    // console.log({ permission });

    if (!permission) {
      throw new ForbiddenException('Access denied: You do not have permission');
    }

    // 2. Get role permissions
    const rolePermissions = await this.prisma.rolePermission.findFirst({
      where: { roleId: user?.roleId, permissionId: permission?.id },
    });

    // const allPermissions = new Set<string>();

    // console.log({ rolePermissions });

    if (!rolePermissions) {
      throw new ForbiddenException('Access denied: You do not have permission');
    }

    return true;
  }
}
