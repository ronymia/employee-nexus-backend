import { ObjectType, Field } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base-response.type';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class Auth {
  @Field(() => String, { description: 'JWT access token' })
  accessToken: string;

  @Field(() => User, { description: 'User associated with the auth' })
  user: User;
}
@ObjectType()
export class ChangeMyPassword {
  @Field(() => String, {
    description: 'Message indicating the result of the password change',
  })
  message: string;
}
@ObjectType()
export class ChangeMyPasswordResponse extends BaseResponse(ChangeMyPassword) {}
