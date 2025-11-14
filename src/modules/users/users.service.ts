import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  create(createUserInput: CreateUserInput) {
    return this.prisma.user.create({
      data: { ...createUserInput, role: { connect: { id: 1 } } },
      include: {
        profile: true,
        business: true,
        userPermissions: {
          include: {
            permission: { select: { resource: true, action: true } },
          },
        },
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: { select: { resource: true, action: true } },
              },
            },
          },
        },
      },
    });
  }

  // GET ALL
  findAll() {
    return this.prisma.user.findMany({
      include: {
        profile: true,
        business: true,
        userPermissions: {
          include: {
            permission: { select: { resource: true, action: true } },
          },
        },
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: { select: { resource: true, action: true } },
              },
            },
          },
        },
      },
    });
  }

  // GET ONE
  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        business: true,
        userPermissions: {
          include: {
            permission: { select: { resource: true, action: true } },
          },
        },
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: { select: { resource: true, action: true } },
              },
            },
          },
        },
      },
    });
  }

  // USER BY EMAIL
  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        business: true,
        userPermissions: {
          include: {
            permission: { select: { resource: true, action: true } },
          },
        },
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
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
      include: {
        profile: true,
        business: true,
        userPermissions: {
          include: {
            permission: { select: { resource: true, action: true } },
          },
        },
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: { select: { resource: true, action: true } },
              },
            },
          },
        },
      },
    });
  }
}
