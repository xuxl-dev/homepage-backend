import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { createPool, Pool } from 'generic-pool'
import IORedis, { Redis } from 'ioredis'
import { randomUUID } from 'crypto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RedisService implements OnModuleInit {
  static do: typeof RedisService.prototype.do
  pool: Pool<Redis>
  private readonly logger = new Logger(RedisService.name)

  constructor(
    configService: ConfigService,
  ) {
    this.pool = createPool(
      {
        async create() {
          return new IORedis(
            {
              host: configService.get('REDIS_HOST'),
              port: configService.get('REDIS_PORT'),
              password: configService.get('REDIS_PASSWORD'),
              db: configService.get('REDIS_DB'),
              lazyConnect: true,
            }
          )
        },
        async destroy(client: Redis) {
          client.disconnect()
        },
      },
      { min: 6, max: 16 },
    )
    RedisService.do = this.do.bind(this)
  }

  async onModuleInit() {
    await this.do(e => e.setex(randomUUID(), 10, 1))
    this.logger.log('RedisService is ready')
  }

  async do<T>(fn: (client: Redis) => Promise<T>): Promise<T> {
    const conn = await this.pool.acquire()
    try {
      return await fn(conn)
    } catch (e) {
      this.logger.warn(`QueryFailed: ${e}`)
      throw e
    } finally {
      await this.pool.release(conn)
    }
  }
}