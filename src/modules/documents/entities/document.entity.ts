import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { Employee } from 'src/modules/users/entities/employee.entity';

@ObjectType()
export class Document {
  @Field(() => ID, { description: 'Unique identifier for the document' })
  id: number;

  @Field(() => Int, { description: 'ID of the employee who owns the document' })
  userId: number;

  @Field(() => Employee, {
    nullable: true,
    description: 'Employee who owns this document',
  })
  employee?: Employee;

  @Field(() => String, { description: 'Title of the document' })
  title: string;

  @Field(() => String, {
    description: 'Description of the document',
    nullable: true,
  })
  description: string | null;

  @Field(() => String, { description: 'Attachment URL or path' })
  attachment: string;

  @Field(() => Date, { description: 'Date when the document was created' })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the document was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class DocumentResponse extends BaseResponse(Document) {}

@ObjectType()
export class DocumentsQueryResponse extends BaseQueryResponse(Document) {}
