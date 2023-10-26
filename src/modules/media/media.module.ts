import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
