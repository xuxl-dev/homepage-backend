import { Module } from '@nestjs/common';
import { ChatgroupService } from './chatgroup.service';
import { ChatgroupController } from './chatgroup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatgroup } from './entities/chatgroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chatgroup])],
  controllers: [ChatgroupController],
  providers: [ChatgroupService],
  exports: [ChatgroupService]
})
export class ChatgroupModule {}
