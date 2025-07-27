import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { SystemModule } from './system-module.entity';

export class SystemModuleResponse extends BaseResponse(SystemModule) {}
export class SystemModuleQueryResponse extends BaseQueryResponse(
  SystemModule,
) {}
