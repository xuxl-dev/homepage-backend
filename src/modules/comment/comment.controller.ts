import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NoRestrict, User } from '../common/decorator/decorators';
import { PaginationQueryDto } from '../common/dtos/pagination.dto';
import { ExtractJwt, JWTGuard } from '../auth/guards/guards.guard';


@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('post')
  @ExtractJwt()
  create(@Body() createCommentDto: CreateCommentDto, @User() user) {
    return this.commentService.create(createCommentDto, user);
  }

  @Get(':limit/:offset')
  findAll(pagination: PaginationQueryDto) {
    return this.commentService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
