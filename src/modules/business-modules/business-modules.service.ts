import { Injectable } from '@nestjs/common';
import { CreateBusinessModuleInput } from './dto/create-business-module.input';
import { UpdateBusinessModuleInput } from './dto/update-business-module.input';

@Injectable()
export class BusinessModulesService {
  create(createBusinessModuleInput: CreateBusinessModuleInput) {
    return 'This action adds a new businessModule';
  }

  findAll() {
    return `This action returns all businessModules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} businessModule`;
  }

  update(id: number, updateBusinessModuleInput: UpdateBusinessModuleInput) {
    return `This action updates a #${id} businessModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} businessModule`;
  }
}
