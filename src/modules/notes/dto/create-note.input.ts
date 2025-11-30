import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

@InputType()
export class CreateNoteInput {
  @Field(() => Int, { description: 'ID of the user this note is about' })
  userId: number;

  @Field(() => String, { description: 'Title of the note' })
  @IsString()
  title: string;

  @Field(() => String, { description: 'Content of the note' })
  @IsString()
  content: string;

  @Field(() => String, { description: 'Category of the note', nullable: true })
  @IsString()
  @IsOptional()
  category?: string;

  @Field(() => Boolean, {
    description: 'Whether the note is private',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;
}
