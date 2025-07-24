import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  create(createUserInput: CreateUserInput) {
    return this.prisma.user.create({
      data: createUserInput,
    });
  }

  // GET ALL
  findAll() {
    return this.prisma.user.findMany({
      include: {
        profile: true, // Include related profile data
      },
    });
  }

  // GET ONE
  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // UPDATE
  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return this.prisma.user.update({
  //     where: { id },
  //     data: updateUserInput,
  //   });
  // }

  // DELETE
  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
