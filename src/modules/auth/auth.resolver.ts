import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { LoginAuthInput } from './dto/login-auth.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // LOGIN ROUTE
  @Mutation(() => Auth, { name: 'login' })
  login(@Args('loginInput') loginAuthInput: LoginAuthInput) {
    return this.authService.login(loginAuthInput);
  }
}
