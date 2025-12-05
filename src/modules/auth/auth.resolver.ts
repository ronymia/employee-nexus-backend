import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth, ChangeMyPasswordResponse } from './entities/auth.entity';
import { LoginAuthInput } from './dto/login-auth.input';
import { ChangeMyPasswordInput } from './dto/change-my-password.input';
import { JwtPayload } from './jwt.strategy';
import { CurrentUser } from './decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // LOGIN ROUTE
  @Mutation(() => Auth, { name: 'login' })
  login(@Args('loginInput') loginAuthInput: LoginAuthInput) {
    return this.authService.login(loginAuthInput);
  }

  // LOGIN ROUTE
  @Mutation(() => ChangeMyPasswordResponse, { name: 'changeMyPassword' })
  @UseGuards(GqlAuthGuard)
  async changeMyPassword(
    @CurrentUser() user: JwtPayload,
    @Args('changeMyPasswordInput') changeMyPasswordInput: ChangeMyPasswordInput,
  ) {
    const result = await this.authService.changeMyPassword(
      user,
      changeMyPasswordInput,
    );
    return {
      success: true,
      message: 'Password changed successfully',
      data: result,
    };
  }
}
