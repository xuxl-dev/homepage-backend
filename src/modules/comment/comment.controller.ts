import { Controller, Get, Post, Body, Patch, Param, Delete, ForbiddenException, Logger } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IntParam, IsAdmin, IsUser, NoRestrict, User } from '../common/decorator/decorators';
import { PaginationQueryDto } from '../common/dtos/pagination.dto';
import { ExtractJwt, JWTGuard } from '../auth/guards/guards.guard';
import { AdminRole, Roles, UserRole } from '../auth/roles/roles.decorators';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post('post')
  @ExtractJwt()
  create(@Body() createCommentDto: CreateCommentDto, @User() user) {
    return this.commentService.create(createCommentDto, user);
  }

  @AdminRole()
  @Get(':limit/:offset')
  findAll(pagination: PaginationQueryDto) {
    return this.commentService.findAll(pagination);
  }

  @UserRole()
  @Get(':id')
  findOne(@IntParam('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @UserRole()
  @Patch(':id')
  async update(
    @IntParam('id') cid: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @IsAdmin() isAdmin: boolean,
    @IsUser() isUser: boolean,
    @User('id') userId: number) {
    const uid = await this.commentService.getUserIdFromCommentId(+cid)
    if (isAdmin || isUser && userId === uid) {
      return this.commentService.update(+cid, updateCommentDto);
    }
    else {
      throw new ForbiddenException();
    }
  }

  @UserRole()
  @Delete(':id')
  async remove(@IntParam('id') cid: number, @IsAdmin() isAdmin: boolean, @User('id') userId: number) {
    const uid = await this.commentService.getUserIdFromCommentId(+cid);
    if (!uid) throw new ForbiddenException(); // Annymous user
    if (isAdmin || uid === userId) {
      return this.commentService.remove(+cid)
    }
    throw new ForbiddenException()
  }
}


