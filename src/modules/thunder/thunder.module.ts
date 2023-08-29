import { Module } from '@nestjs/common';
import { ThunderService } from './thunder.service';
import { ThunderController } from './thunder.controller';

@Module({
  controllers: [ThunderController],
  providers: [ThunderService]
})
export class ThunderModule {}
