import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Asset } from './asset.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class AssetAssignment {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  assetId: number;

  @Field(() => Asset)
  asset: Asset;

  @Field(() => Int)
  assignedTo: number;

  @Field(() => User)
  assignedToUser: User;

  @Field(() => Int)
  assignedBy: number;

  @Field(() => User, { nullable: true })
  assignedByUser?: User;

  @Field()
  assignedAt: Date;

  @Field({ nullable: true })
  returnedAt?: Date;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
