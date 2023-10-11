import { Module } from '@nestjs/common';
import { ChatgroupService } from './chatgroup.service';
import { ChatgroupController } from './chatgroup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGroup } from './entities/chatgroup.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatGroup]), UserModule],
  controllers: [ChatgroupController],
  providers: [ChatgroupService],
  exports: [ChatgroupService]
})
export class ChatgroupModule {}
