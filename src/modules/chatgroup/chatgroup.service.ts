import { Injectable } from '@nestjs/common';
import { CreateChatgroupDto } from './dto/create-chatgroup.dto';
import { UpdateChatgroupDto } from './dto/update-chatgroup.dto';
import { Repository } from 'typeorm';
import { ChatGroup } from './entities/chatgroup.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinChatGroupDto } from './dto/join-chatgroup.dto';
import { UserService } from '../user/user.service';


@Injectable()
export class ChatgroupService {

  constructor(
    @InjectRepository(ChatGroup)
    private readonly chatgroupRepository: Repository<ChatGroup>,
    private readonly userService : UserService
  ) { }

  async create(createChatgroupDto: CreateChatgroupDto) {
    return await this.chatgroupRepository.save(createChatgroupDto);
  }

  async findAll() {
    return await this.chatgroupRepository.find();
  }

  async findMyGroups(userId: number) {
    return await this.chatgroupRepository.createQueryBuilder('chatgroup')
      .leftJoinAndSelect('chatgroup.members', 'members')
      .where('members.id = :userId', { userId })
      .getMany()
  }

  async findOne(id: number) {
    return await this.chatgroupRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateChatgroupDto: UpdateChatgroupDto) {
    return await this.chatgroupRepository.update(id, updateChatgroupDto);
  }

  async remove(id: number) {
    return await this.chatgroupRepository.delete(id);
  }

  async join(joinChatGroupDto: JoinChatGroupDto) {
    const { userId, groupId } = joinChatGroupDto
    const group = await this.chatgroupRepository.findOneOrFail({ where: { id: groupId } })
    const user = await this.userService.findOne(userId)
    if (!group || !user) {
      throw new Error('group or user not found')
    }
    group.members.push(user)
    return await this.chatgroupRepository.save(group) //this is cascade save
  }

  async isGroupAdmin(groupId: number, userId: number) {
    const group = await this.chatgroupRepository.findOneOrFail({
      where: { id: groupId },
    });
    return group.admins.some(admin => admin.id === userId);
  }

  async addGroupAdmin(groupId: number, userId: number) {
    const group = await this.chatgroupRepository.findOneOrFail({
      where: { id: groupId },
    });
    const user = await this.userService.findOne(userId)
    if (!group || !user) {
      throw new Error('group or user not found')
    }
    group.admins.push(user)
    return await this.chatgroupRepository.save(group) //this is cascade save
  }

  async getMembers(groupId: number) {
    const group = await this.chatgroupRepository.findOneOrFail({
      where: { id: groupId },
    });
    return group.members
  }
}
