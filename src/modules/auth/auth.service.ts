import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthInput } from './dto/login-auth.input';
import { UsersService } from '../users/users.service';
import { PasswordHelpers } from 'src/helpers/passwordHelpers';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { PermissionUtils } from 'src/utils/permission.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    // private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // This method is used to validate the user by email
  async validateUserByEmail(email: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user) {
      return user;
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
      businessId: user?.business?.id,
    };

    // Generate JWT token
    const accessToken = this.jwtService.sign(payload);

    user['permissions'] = PermissionUtils.formatUserPermissions(user as any);

    return {
      accessToken,
      user,
    };
  }
}
