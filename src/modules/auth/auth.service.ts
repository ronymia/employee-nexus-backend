import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthInput } from './dto/login-auth.input';
import { UsersService } from '../users/users.service';
import { PasswordHelpers } from 'src/helpers/passwordHelpers';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    // private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // This method is used by the local strategy to validate the user
  async validateUserByEmail(email: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user) {
      return user;
    }
    return null;
  }
  // async validateUser(email: string, pass: string): Promise<any> {
  //   const user = await this.userService.findByEmail(email);
  //   console.log('from validateUser', user);

  //   if (user) {
  //     const { password, ...result } = user;
  //     const isMatchPassword = await PasswordHelpers.passwordMatch(
  //       password,
  //       pass,
  //     );

  //     // Check if password is correct
  //     if (!isMatchPassword) {
  //       throw new UnauthorizedException();
  //     }

  //     // If password is correct, return the user without the password field
  //     // This is important for security reasons, as we don't want to expose the password
  //     // in the response.
  //     // If you want to return the user with the password field, you can remove the line
  //     // const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async login(loginAuthInput: LoginAuthInput) {
    // console.log({ user });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = await this.validateUserByEmail(loginAuthInput.email);

    // If user does not exist, throw an UnauthorizedException
    if (!user || !user?.password) {
      throw new UnauthorizedException();
    }

    const isMatchPassword = await PasswordHelpers.passwordMatch(
      loginAuthInput.password,
      user?.password,
    );

    // Check if password is correct
    // If the user does not have a password, it means they are using a third-party
    if (!isMatchPassword) {
      throw new UnauthorizedException();
    }

    const payload = { userId: user?.id, roleId: user?.role };

    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
    };
  }

  // async login(loginAuthInput: LoginAuthInput) {
  //   console.log(loginAuthInput);
  //   return 'This action adds a new auth';
  // }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthInput: UpdateAuthInput) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
