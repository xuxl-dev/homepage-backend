import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Fourm } from '../fourm/entities/fourm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Fourm]), AuthModule, ConfigModule],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
