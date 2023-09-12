import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Message } from '../internal-message/entities/message-new.entity';


/**
 * feature:
 * 通过回执计数来避免恶意的客户端修改回执逻辑，
 * 当送达回执未收到时，不发送下一条消息
 * （用户自行设置）当已读回执未收到时，不发送下一条消息
 */

@Injectable()
export class OfflineMessageService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
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
  /**
   * retrieve offline messages for a user including chat and chat group
   * Then delete it from database (if marked as e2e encrypted, delete it immediately, 
   * if marked as not to delete, do not delete it)
   * @param userId 
   */
  async retrive(userId: number) {
    return await this.messageRepository.find({ where: { receiverId: userId } })
  }

  async deleteBefore(date: Date){
    // 查询并删除过期消息
    const expiredMessages = await this.messageRepository.createQueryBuilder()
    .where('createdAt <= :date', { date })
    .delete()
    .execute();

    return expiredMessages
  }

  

}
