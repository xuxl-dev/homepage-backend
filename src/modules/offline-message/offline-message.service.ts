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

  // async sendMessageOrFail(message: InternalMessage) {
  //   console.log('sendMessageOrFail,', message)
  //   await this.offlineMessageRepository.save(OfflineMessage.fromInternal(message))
  // }
  async sendMessageOrFail(message) {}
  /**
   * retrieve offline messages for a user including chat and chat group
   * Then delete it from database (if marked as e2e encrypted, delete it immediately, 
   * if marked as not to delete, do not delete it)
   * @param userId 
   */
  // async retrive(userId: number) {
  //   const ret = []
  //   // select all records with receiverId = userId
  //   ret.concat(await this.offlineMessageRepository.find({ where: { receiverId: userId } }))
  //   // retrive groups of user
  //   const { joinedChatGroups } = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['joinedChatGroups']
  //   })
  //   joinedChatGroups.forEach(async (group) => {
  //     ret.concat(await this.offlineMessageRepository.find({ where: { receiverId: group.id } })) //TODO: test this
  //   })
  //   return ret
  // }
  async retrive(id) {
    return []
  }
}
