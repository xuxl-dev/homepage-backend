import { Injectable } from '@nestjs/common';
import { RedisService } from '../db/redis/redis.service';
import { UserStatus } from './entities/usermeta.entity';

@Injectable()
export class UsermetaService {
  prefix = 'usermeta_'
  constructor(
    private readonly redisService: RedisService,
  ) {}

  online(userId:number) {
    return this.redisService.set(this.prefix + userId, UserStatus.ONLINE)
  }

  offline(userId:number) {
    return this.redisService.set(this.prefix + userId, UserStatus.OFFLINE)
  }

  getStatus(userId:number) {
    try {
      return +this.redisService.get(this.prefix + userId) as UserStatus
    } catch {
      return UserStatus.UNKNOWN
    }
  }

}
