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
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  // CREATE DOCUMENT
  @Mutation(() => DocumentResponse, { name: 'createDocument' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Document:create')
  @UseGuards(GqlAuthGuard)
  async createDocument(
    @Args('createDocumentInput') createDocumentInput: CreateDocumentInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.documentsService.create({
      user,
      createDocumentInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Document created successfully`,
      data: result,
    };
  }

  // FIND ALL DOCUMENTS
  @Query(() => DocumentsQueryResponse, { name: 'documents' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Document:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryDocumentInput,
  ) {
    const result = await this.documentsService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Documents retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE DOCUMENT
  @Query(() => DocumentResponse, { name: 'documentById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Document:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.documentsService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Document retrieved successfully`,
      data: result,
    };
  }

  // UPDATE DOCUMENT
  @Mutation(() => DocumentResponse, { name: 'updateDocument' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Document:update')
  @UseGuards(GqlAuthGuard)
  async updateDocument(
    @CurrentUser() user: JwtPayload,
    @Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput,
  ) {
    const result = await this.documentsService.update({
      user,
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
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Document:delete')
  @UseGuards(GqlAuthGuard)
  async removeDocument(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.documentsService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Document deleted successfully`,
      data: result,
    };
  }
}
