import { Module } from '@nestjs/common';
import { AssetTypesService } from './asset-types.service';
import { AssetTypesResolver } from './asset-types.resolver';

@Module({
  providers: [AssetTypesResolver, AssetTypesService],
})
export class AssetTypesModule {}
