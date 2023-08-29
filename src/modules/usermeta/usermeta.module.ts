import { Module } from '@nestjs/common';
import { UsermetaService } from './usermeta.service';
import { UsermetaController } from './usermeta.controller';

@Module({
  controllers: [UsermetaController],
  providers: [UsermetaService]
})
export class UsermetaModule {}
