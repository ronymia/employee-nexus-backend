// import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// import { EducationHistoriesService } from './education-histories.service';
// import {
//   EducationHistory,
//   EducationHistoryResponse,
//   EducationHistoriesQueryResponse,
// } from './entities/education-history.entity';
// import { CreateEducationHistoryInput } from './dto/create-education-history.input';
// import { UpdateEducationHistoryInput } from './dto/update-education-history.input';
// import { HttpStatus, UseGuards } from '@nestjs/common';
// import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
// import { JwtPayload } from '../auth/jwt.strategy';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';

// @Resolver(() => EducationHistory)
// export class EducationHistoriesResolver {
//   constructor(
//     private readonly educationHistoriesService: EducationHistoriesService,
//   ) {}

//   // CREATE EDUCATION HISTORY
//   @Mutation(() => EducationHistoryResponse, {
//     name: 'createEducationHistory',
//   })
//   @UseGuards(GqlAuthGuard)
//   async createEducationHistory(
//     @Args('createEducationHistoryInput')
//     createEducationHistoryInput: CreateEducationHistoryInput,
//     @CurrentUser() user: JwtPayload,
//   ) {
//     const result = await this.educationHistoriesService.create({
//       user,
//       createEducationHistoryInput,
//     });
//     return {
//       success: true,
//       statusCode: HttpStatus.CREATED,
//       message: `Education history created successfully`,
//       data: result,
//     };
//   }

//   // FIND ALL EDUCATION HISTORIES
//   @Query(() => EducationHistoriesQueryResponse, {
//     name: 'educationHistoryByUserId',
//   })
//   @UseGuards(GqlAuthGuard)
//   async findAll(
//     @CurrentUser() user: JwtPayload,
//     @Args('userId', { type: () => Int }) userId: number,
//   ) {
//     const result = await this.educationHistoriesService.findAll({ userId });
//     return {
//       success: true,
//       statusCode: HttpStatus.OK,
//       message: `Education histories retrieved successfully`,
//       data: result,
//     };
//   }

//   // FIND ONE EDUCATION HISTORY
//   @Query(() => EducationHistoryResponse, { name: 'educationHistory' })
//   @UseGuards(GqlAuthGuard)
//   async findOne(
//     @Args('id', { type: () => Int }) id: number,
//     @Args('userId', { type: () => Int }) userId: number,
//   ) {
//     const result = await this.educationHistoriesService.findOne({ userId, id });

//     return {
//       success: true,
//       statusCode: HttpStatus.OK,
//       message: `Education history retrieved successfully`,
//       data: result,
//     };
//   }

//   // UPDATE EDUCATION HISTORY
//   @Mutation(() => EducationHistoryResponse, {
//     name: 'updateEducationHistory',
//   })
//   @UseGuards(GqlAuthGuard)
//   async updateEducationHistory(
//     @Args('updateEducationHistoryInput')
//     updateEducationHistoryInput: UpdateEducationHistoryInput,
//   ) {
//     const result = await this.educationHistoriesService.update({
//       id: updateEducationHistoryInput.id,
//       updateEducationHistoryInput,
//     });
//     return {
//       success: true,
//       statusCode: HttpStatus.OK,
//       message: `Education history updated successfully`,
//       data: result,
//     };
//   }

//   // REMOVE EDUCATION HISTORY
//   @Mutation(() => EducationHistoryResponse, {
//     name: 'deleteEducationHistory',
//   })
//   @UseGuards(GqlAuthGuard)
//   async removeEducationHistory(
//     @Args('id', { type: () => Int }) id: number,
//     @Args('userId', { type: () => Int }) userId: number,
//   ) {
//     const result = await this.educationHistoriesService.remove({ userId, id });
//     return {
//       success: true,
//       statusCode: HttpStatus.OK,
//       message: `Education history deleted successfully`,
//       data: result,
//     };
//   }
// }
