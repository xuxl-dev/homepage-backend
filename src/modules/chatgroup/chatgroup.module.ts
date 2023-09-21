import { Module } from '@nestjs/common';
import { ChatgroupService } from './chatgroup.service';
import { ChatgroupController } from './chatgroup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGroup } from './entities/chatgroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatGroup])],
  controllers: [ChatgroupController],
  providers: [ChatgroupService],
  exports: [ChatgroupService]
})
export class ChatgroupModule {}
