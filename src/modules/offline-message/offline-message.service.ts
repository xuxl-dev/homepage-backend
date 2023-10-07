import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message as Message, MsgId } from '../internal-message/schemas/message.schema';


/**
 * feature:
 * 通过回执计数来避免恶意的客户端修改回执逻辑，
 * 当送达回执未收到时，不发送下一条消息
 * （用户自行设置）当已读回执未收到时，不发送下一条消息
 */

@Injectable()
export class OfflineMessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>
  ) { }

  /** 
   * Note that this won't duplicate message if the id is unique
   * and in db, a unique constraint is set on msgId
   * so this is safe to call even if the message is already in db 
   * (aka it's a latened offline message converted into online message,
   * but it fails again, then convert into offline message again)
   * */
  async sendMessageOrFail(message: Message) {
    return await this.messageModel.create(message)
  }
  /**
   * retrieve offline messages for a user including chat and chat group
   * Then delete it from database (if marked as e2e encrypted, delete it immediately, 
   * if marked as not to delete, do not delete it)
   * @param userId 
   */
  async retrive(userId: number, afterDate?: Date, pagination?: { page: number, pageSize: number }) {
    return await this.messageModel.find(
      {
        receiverId: userId,
        sentAt: { $gte: afterDate }
      },
      null,
      {
        limit: pagination?.pageSize,
        skip: pagination?.page * pagination?.pageSize
      }
    )
  }

  /**
   * @param id: Not mongo _id, but the message id
   * @returns 
   */
  async findOne(id: MsgId) {
    try {
      return await this.messageModel.findById(id)
    } catch (error) {
      return null
    }
  }

  /**
   * @param id 
   * @param receiverId not used, but for future use
   */
  async updateReadCount(id: MsgId, receiverId: number) {
    const msg = await this.findOne(id)
    if (msg) {
      msg.hasReadCount += 1
      await msg.save()
    }
  }

  async delete(id: MsgId) {
    this.messageModel.deleteOne({ msgId: id })
  }
}
