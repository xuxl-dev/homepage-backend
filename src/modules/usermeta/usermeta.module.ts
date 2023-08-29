import { Module } from '@nestjs/common';
import { UsermetaService } from './usermeta.service';
import { UsermetaController } from './usermeta.controller';
import { RedisModule } from '../db/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [UsermetaController],
  providers: [UsermetaService]
})
export class UsermetaModule {}
