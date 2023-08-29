import { Injectable } from '@nestjs/common';
import { CreateUsermetaDto } from './dto/create-usermeta.dto';
import { UpdateUsermetaDto } from './dto/update-usermeta.dto';
import { CacheService } from '../db/redis/cache.service';

@Injectable()
export class UsermetaService {

  constructor(
    private readonly cacheService: CacheService,
  ) {}

  create(createUsermetaDto: CreateUsermetaDto) {
    return 'This action adds a new usermeta';
  }

  findAll() {
    return `This action returns all usermeta`;
  }

}
