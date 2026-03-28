import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthInput } from './dto/login-auth.input';
import { UsersService } from '../users/users.service';
import { PasswordHelpers } from 'src/helpers/passwordHelpers';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { PermissionUtils } from 'src/utils/permission.utils';
import { ChangeMyPasswordInput } from './dto/change-my-password.input';
import { JwtPayload } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly prisma: PrismaService,
    // private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // This method is used to validate the user by email
  async validateUserByEmail(email: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return user as any;
    }
    return null;
  }

  // LOGIN METHOD
  async login(loginAuthInput: LoginAuthInput) {
    const user = await this.validateUserByEmail(loginAuthInput.email);

    // If user does not exist, throw an UnauthorizedException
    if (!user || !user?.password) {
      throw new UnauthorizedException();
    }

    const isMatchPassword = await PasswordHelpers.passwordMatch(
      loginAuthInput.password,
      user?.password,
    );

    // console.log({ permissions: user.role?.rolePermissions });

    // Check if password is correct
    if (!isMatchPassword) {
      throw new UnauthorizedException();
    }

    // TOKEN PAYLOAD
    const payload = {
      userId: user?.id,
      roleId: user?.roleId,
      businessId: user?.businessId,
    };

    // Generate JWT token
    const accessToken = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    // user['permissions'] = PermissionUtils.formatUserPermissions(user as any);

    return {
      accessToken,
      user,
    };
  }

  async changeMyPassword(
    user: JwtPayload,
    changeMyPasswordInput: ChangeMyPasswordInput,
  ) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: { id: true, password: true },
    });
    if (!existingUser || !existingUser.password) {
      throw new UnauthorizedException('User not found');
    }

    const isMatchPassword = await PasswordHelpers.passwordMatch(
      changeMyPasswordInput.currentPassword,
      existingUser.password,
    );

    // Check if current password is correct
    if (!isMatchPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedNewPassword = await PasswordHelpers.passwordHash(
      changeMyPasswordInput.newPassword,
    );

    await this.prisma.user.update({
      where: { id: user.userId },
      data: { password: hashedNewPassword },
    });

    return {
      message: 'Password changed successfully',
    };
  }
}
