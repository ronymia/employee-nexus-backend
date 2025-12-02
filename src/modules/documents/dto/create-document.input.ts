import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateDocumentInput {
  @Field(() => Int, { description: 'ID of the user' })
  userId: number;

  @Field(() => String, { description: 'Title of the document' })
  @IsString()
  title: string;

  @Field(() => String, {
    description: 'Description of the document',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => String, { description: 'Attachment URL or path' })
  @IsString()
  attachment: string;
}
