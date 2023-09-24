import { Job } from 'bull';
import { OnQueueFailed, Process } from '@nestjs/bull';
import { Processor } from '@nestjs/bull';
import { Dispatcher } from './dispatcher';
import { Message } from '../internal-message/schemas/message.schema';

@Processor('message')
export class MessageQueue {
  constructor(
    private readonly dispatcher: Dispatcher,
  ) { }

  /**
   * Non-blocking send message
   * @param job 
   * @returns 
   */
  @Process('send')
  send(job: Job<Message>) {
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