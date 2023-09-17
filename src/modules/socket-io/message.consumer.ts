import { Job } from 'bull';
import { OnQueueFailed, Process } from '@nestjs/bull';
import { Processor } from '@nestjs/bull';
import { SocketIoService } from './socket-io.service';
import { Message } from '../internal-message/entities/message-new.entity';

@Processor('message')
export class MessageQueue {
  constructor(
    private readonly socketIoService: SocketIoService,
  ) { }

  @Process('send')
  async send(job: Job<Message>) {
    try {
      await this.socketIoService.safeSendMessage(job.data)
      return Promise.resolve()
    } catch (error) {
      console.error('Error while sending message:', error)
      return Promise.reject(error)
    }
  }

  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    console.error(`Job ${job.id} failed: ${error.message}`)
  }
}