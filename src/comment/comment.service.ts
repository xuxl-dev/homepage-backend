import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { User } from 'src/user/entities/user.entity';
import { Fourm } from 'src/fourm/entities/fourm.entity';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository : Repository<Comment>,
    @InjectRepository(Fourm)
    private readonly fourmRepository : Repository<Fourm>,
    ) {}

  async create(createCommentDto: CreateCommentDto, user: User = undefined) {
    // Logger.debug(`createCommentDto: ${JSON.stringify(createCommentDto)}`);
    Logger.debug(`user: ${JSON.stringify(user)}`);
    // TODO: 如果是未登录的用户要验证码
    if(!createCommentDto.content) throw new BadRequestException('content is required');
    // if(!createCommentDto.belongsTo) throw new BadRequestException('belongsTo is required');
    const comment = Comment.create(
      createCommentDto.content, 
      (user && user.username) ?? createCommentDto.displayName ?? 'Anonymous', //用户名优先，如果没有使用displayName，如果未设置使用Anonymous
      await this.fourmRepository.findOne({where:{id: createCommentDto.belongsTo}}),
      await this.commentRepository.findOne({where:{id: createCommentDto.replyTo}}),
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
    this.commentRepository.findOne({where: {id}});
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    throw new Error('Method not implemented.');
  }

  remove(id: number) {
    throw new Error('Method not implemented.');
  }
}
