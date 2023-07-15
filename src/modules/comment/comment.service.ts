import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dtos/pagination.dto';
import { User } from '../user/entities/user.entity';
import { Fourm } from '../fourm/entities/fourm.entity';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository : Repository<Comment>,
    @InjectRepository(Fourm)
    private readonly fourmRepository : Repository<Fourm>,
    ) {}

  async create(createCommentDto: CreateCommentDto, user: User = undefined) {
    // TODO: 如果是未登录的用户要验证码
    if(!createCommentDto.content) throw new BadRequestException('content is required');
    // if(!createCommentDto.belongsTo) throw new BadRequestException('belongsTo is required');

    const comment = Comment.create(
      createCommentDto.content, 
      (user && user.username) ?? createCommentDto.displayName ?? 'Anonymous',             //用户名优先，如果没有使用displayName，如果未设置使用Anonymous
      await this.fourmRepository.findOne({where:{id: createCommentDto.belongsTo ?? -1}}), //不能设置为undefined，会返回第一个记录
      await this.commentRepository.findOne({where:{id: createCommentDto.replyTo ?? -1}}), //不能设置为undefined，会返回第一个记录
      user);

    return this.commentRepository.save(comment);
  }

  findAll(pagination: PaginationQueryDto) {
    this.commentRepository.find({
      skip: pagination.offset,
      take: pagination.limit,
    })
  }

  findOne(id: number) {
    return this.commentRepository.findOne({where: {id}});
  }

  async getUserIdFromCommentId(id: number) {
    return ((await this.commentRepository.findOne({where: {id}, relations: ['createdBy']})).createdBy ?? null)?.id;
  }




  update(id: number, updateCommentDto: UpdateCommentDto) {
    
  }

  async remove(id: number) {
    return await this.commentRepository.delete({id});
  }
}
