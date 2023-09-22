import { Job } from 'bull';
import { OnQueueFailed, Process } from '@nestjs/bull';
import { Processor } from '@nestjs/bull';
import { Message_old } from '../internal-message/entities/message-new.entity';
import { Dispatcher } from './dispatcher';

@Processor('message')
export class MessageQueue {
  constructor(
    private readonly dispatcher: Dispatcher,
  ) { 
    console.debug('MessageQueue created')
  }

  /**
   * Non-blocking send message
   * @param job 
   * @returns 
   */
  @Process('send')
  send(job: Job<Message_old>) {
    console.debug('Message dispatched', job.data)
    try {
      this.dispatcher.dispatch(job.data)
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