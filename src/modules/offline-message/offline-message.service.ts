import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Message } from '../internal-message/entities/message-new.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message2 } from '../internal-message/schemas/message.schema';



/**
 * feature:
 * 通过回执计数来避免恶意的客户端修改回执逻辑，
 * 当送达回执未收到时，不发送下一条消息
 * （用户自行设置）当已读回执未收到时，不发送下一条消息
 */

@Injectable()
export class OfflineMessageService {

  constructor(
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectModel(Message2.name)
    private readonly messageModel: Model<Message2>
  ) { }

  /** 
   * Note that this won't duplicate message if the id is unique
   * and in db, a unique constraint is set on msgId
   * so this is safe to call even if the message is already in db 
   * (aka it's a latened offline message converted into online message,
   * but it fails again, then convert into offline message again)
   * */
  async sendMessageOrFail(message: Message) {
    return await this.messageRepository.save(message)
  }

  async sendMessageOrFail2(message: Message2) {
    return await this.messageModel.create(message)
  }
  /**
   * retrieve offline messages for a user including chat and chat group
   * Then delete it from database (if marked as e2e encrypted, delete it immediately, 
   * if marked as not to delete, do not delete it)
   * @param userId 
   */
  async retrive(userId: number, afterDate?: Date, pagination?: { page: number, pageSize: number }) {
    return await this.messageRepository.find(
      {
        where: {
          receiverId: userId,
          sentAt: MoreThanOrEqual(afterDate)
        },
        take: pagination?.pageSize,
        skip: pagination?.page * pagination?.pageSize
      }
    )
  }

  async retrive2(userId: number, afterDate?: Date, pagination?: { page: number, pageSize: number }) {
    return await this.messageModel.find(
      {
        receiverId: userId,
        sentAt: MoreThanOrEqual(afterDate)
      },
      null,
      {
        limit: pagination?.pageSize,
        skip: pagination?.page * pagination?.pageSize
      }
    )
  }

  async deleteBefore(date: Date) {
    // 查询并删除过期消息
    const expiredMessages = await this.messageRepository.createQueryBuilder()
      .where('createdAt <= :date', { date })
      .delete()
      .execute();

    return expiredMessages
  }

  async deleteBefore2(date: Date) : Promise<number> {
    const expiredMessages = await this.messageModel.deleteMany({ createdAt: { $lte: date } })
    return expiredMessages.deletedCount
  }

  async findOne(id: string) {
    try {
      return await this.messageRepository.findOneOrFail({ where: { msgId: id } })
    } catch (error) {
      return null
    }
  }

  /**
   * 
   * @param id auto generated mongoose _id
   * @returns 
   */
  async findOne2(id: string) {
    try {
      return await this.messageModel.findById(id)
    } catch (error) {
      return null
    }
  }

  /**
   * 
   * @param id 
   * @param receiverId not used, but for future use
   */
  async updateReadCount(id: string, receiverId: number) {
    const msg = await this.findOne(id)
    if (msg) {
      msg.hasReadCount += 1
      await this.messageRepository.save(msg)
    }
  }

  async updateReadCount2(id: string, receiverId: number) {
    const msg = await this.findOne2(id)
    if (msg) {
      msg.hasReadCount += 1
      await msg.save()
    }
  }
}
