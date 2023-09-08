import { Injectable } from '@nestjs/common';
import { InternalMessage } from '../internal-message/entities/internal-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OfflineMessage } from './entities/offline-message.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';


/**
 * feature:
 * 通过回执计数来避免恶意的客户端修改回执逻辑，
 * 当送达回执未收到时，不发送下一条消息
 * （用户自行设置）当已读回执未收到时，不发送下一条消息
 */

@Injectable()
export class OfflineMessageService {

  constructor(
    @InjectRepository(OfflineMessage)
    private readonly offlineMessageRepository: Repository<OfflineMessage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  /** 
   * Note that this won't duplicate message if the id is unique
   * and in db, a unique constraint is set on msgId
   * so this is safe to call even if the message is already in db 
   * (aka it's a latened offline message converted into online message,
   * but it fails again, then convert into offline message again)
   * */

  async sendMessageOrFail(message: InternalMessage) {
    return await this.offlineMessageRepository.save(OfflineMessage.fromInternal(message))
  }
  /**
   * retrieve offline messages for a user including chat and chat group
   * Then delete it from database (if marked as e2e encrypted, delete it immediately, 
   * if marked as not to delete, do not delete it)
   * @param userId 
   */
  async retrive(userId: number) {
    let ret : OfflineMessage[] = []
    // select all records with receiverId = userId
    ret = ret.concat(await this.offlineMessageRepository.find({ where: { receiverId: userId } })) //TODO this may have efficiency problem
    // retrive groups of user
    const { joinedChatGroups } = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['joinedChatGroups']
    })
    joinedChatGroups.forEach(async (group) => {
      ret = ret.concat(await this.offlineMessageRepository.find({ where: { receiverId: group.id } })) //TODO: test this, check this
    })
    return ret
  }

}
