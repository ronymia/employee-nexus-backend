import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotesService } from './notes.service';
import { Note, NoteResponse, NotesQueryResponse } from './entities/note.entity';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateNoteInput } from './dto/update-note.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QueryNoteInput } from './dto/query-note.input';

@Resolver(() => Note)
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  // CREATE NOTE
  @Mutation(() => NoteResponse, { name: 'createNote' })
  // @UseGuards(PermissionsGuard)
  @RequirePermissions('Note:create')
  @UseGuards(GqlAuthGuard)
  async createNote(
    @Args('createNoteInput') createNoteInput: CreateNoteInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.notesService.create({
      user,
      createNoteInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Note created successfully`,
      data: result,
    };
  }

  // FIND ALL NOTES
  @Query(() => NotesQueryResponse, { name: 'notesByUserId' })
  // @UseGuards(PermissionsGuard)
  @RequirePermissions('Note:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('query', { nullable: true }) query: QueryNoteInput,
  ) {
    const result = await this.notesService.findAll({ userId, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Notes retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE NOTE
  @Query(() => NoteResponse, { name: 'note' })
  // @UseGuards(PermissionsGuard)
  @RequirePermissions('Note:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.notesService.findOne({ userId, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Note retrieved successfully`,
      data: result,
    };
  }

  // UPDATE NOTE
  @Mutation(() => NoteResponse, { name: 'updateNote' })
  // @UseGuards(PermissionsGuard)
  @RequirePermissions('Note:update')
  @UseGuards(GqlAuthGuard)
  async updateNote(@Args('updateNoteInput') updateNoteInput: UpdateNoteInput) {
    const result = await this.notesService.update({
      id: updateNoteInput.id,
      updateNoteInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Note updated successfully`,
      data: result,
    };
  }

  // REMOVE NOTE
  @Mutation(() => NoteResponse, { name: 'deleteNote' })
  // @UseGuards(PermissionsGuard)
  @RequirePermissions('Note:delete')
  @UseGuards(GqlAuthGuard)
  async removeNote(
    @Args('id', { type: () => Int }) id: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.notesService.remove({ userId, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Note deleted successfully`,
      data: result,
    };
  }
}
