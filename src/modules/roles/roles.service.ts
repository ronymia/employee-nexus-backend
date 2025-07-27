import { Injectable } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { PrismaService } from '../prisma/prisma.service';
import { ROLE } from 'src/enums';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRoleInput: CreateRoleInput) {
    return this.prisma.role.create({ data: createRoleInput });
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findOne(id: number) {
    return this.prisma.role.findUnique({ where: { id } });
  }

  update(id: number, updateRoleInput: UpdateRoleInput) {
    return this.prisma.role.update({ where: { id }, data: updateRoleInput });
  }

  remove(id: number) {
    return this.prisma.role.delete({ where: { id } });
  }
}
