import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import {
  Document,
  DocumentResponse,
  DocumentsQueryResponse,
} from './entities/document.entity';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QueryDocumentInput } from './dto/query-document.input';

@Resolver(() => Document)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  // CREATE DOCUMENT
  @Mutation(() => DocumentResponse, { name: 'createDocument' })
  @RequirePermissions('Document:create')
  async createDocument(
    @Args('createDocumentInput') createDocumentInput: CreateDocumentInput,
    @CurrentUser() user: JwtPayload,
  ) {
    // Override userId from JWT to prevent cross-user document assignment
    const result = await this.documentsService.create({
      user,
      createDocumentInput: { ...createDocumentInput, userId: user.userId },
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Document created successfully`,
      data: result,
    };
  }

  // FIND ALL DOCUMENTS
  @Query(() => DocumentsQueryResponse, { name: 'documentsByUserId' })
  @RequirePermissions('Document:read')
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('query', { nullable: true }) query: QueryDocumentInput,
  ) {
    const result = await this.documentsService.findAll({ userId, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Documents retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE DOCUMENT
  @Query(() => DocumentResponse, { name: 'document' })
  @RequirePermissions('Document:read')
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.documentsService.findOne({ userId, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Document retrieved successfully`,
      data: result,
    };
  }

  // UPDATE DOCUMENT
  @Mutation(() => DocumentResponse, { name: 'updateDocument' })
  @RequirePermissions('Document:update')
  async updateDocument(
    @Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput,
  ) {
    const result = await this.documentsService.update({
      id: updateDocumentInput.id,
      updateDocumentInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Document updated successfully`,
      data: result,
    };
  }

  // REMOVE DOCUMENT
  @Mutation(() => DocumentResponse, { name: 'deleteDocument' })
  @RequirePermissions('Document:delete')
  async removeDocument(
    @Args('id', { type: () => Int }) id: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.documentsService.remove({ userId, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Document deleted successfully`,
      data: result,
    };
  }
}
