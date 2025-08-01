import { Resolver } from '@nestjs/graphql';
import { Profile } from './entities/profile.entity';

@Resolver(() => Profile)
export class ProfilesResolver {
  // constructor(private readonly profilesService: ProfilesService) {}
  // @Mutation(() => Profile)
  // createProfile(
  //   @Args('createProfileInput') createProfileInput: CreateProfileInput,
  // ) {
  //   return this.profilesService.create(createProfileInput);
  // }
  // @Query(() => [Profile], { name: 'profiles' })
  // findAll() {
  //   return this.profilesService.findAll();
  // }
  // @Query(() => Profile, { name: 'profile' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.profilesService.findOne(id);
  // }
  // @Mutation(() => Profile)
  // updateProfile(
  //   @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  // ) {
  //   return this.profilesService.update(
  //     updateProfileInput.id,
  //     updateProfileInput,
  //   );
  // }
  // @Mutation(() => Profile)
  // removeProfile(@Args('id', { type: () => Int }) id: number) {
  //   return this.profilesService.remove(id);
  // }
}
