import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { SystemModule } from './system-module.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SystemModuleResponse extends BaseResponse(SystemModule) {}
@ObjectType()
export class SystemModuleQueryResponse extends BaseQueryResponse(
  SystemModule,
) {}
