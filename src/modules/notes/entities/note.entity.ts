import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

@ObjectType()
export class Note {
  @Field(() => ID, { description: 'Unique identifier for the note' })
  id: number;

  @Field(() => Int, { description: 'ID of the user this note is about' })
  userId: number;

  @Field(() => Int, { description: 'ID of the user who created this note' })
  createdBy: number;

  @Field(() => String, { description: 'Title of the note' })
  title: string;

  @Field(() => String, { description: 'Content of the note' })
  content: string;

  @Field(() => String, { description: 'Category of the note', nullable: true })
  category: string | null;

  @Field(() => Boolean, { description: 'Whether the note is private' })
  isPrivate: boolean;

  @Field(() => Date, { description: 'Date when the note was created' })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the note was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class NoteResponse extends BaseResponse(Note) {}

@ObjectType()
export class NotesQueryResponse extends BaseQueryResponse(Note) {}
