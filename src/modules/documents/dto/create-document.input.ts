import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateDocumentInput {
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
