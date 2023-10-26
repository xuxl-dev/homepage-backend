import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import OSS from 'ali-oss';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Media } from './entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MediaService {
  constructor(
    private readonly configService : ConfigService,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>
  ){}

  client = new OSS({
    region: 'oss-cn-hangzhou',
    accessKeyId: this.configService.getOrThrow('OSS_ACCESS_KEY_ID'),
    accessKeySecret: this.configService.getOrThrow('OSS_ACCESS_KEY_SECRET'),
    bucket: 'xlxuchat'
  })

  create(createMediaDto: CreateMediaDto) {
    return 'This action adds a new media';
  }

  findAll() {
    return `This action returns all media`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }

  formatName(file: Express.Multer.File, user: User) {
    // [user_id]_[timestamp]_[unique_identifier].[extension]
    const originalName = file.originalname
    const extension = originalName.split('.').pop() ?? 'unknown'
    const timestamp = Date.now()
    const uniqueIdentifier = Math.random().toString(36).substring(2, 7)
    const filename = `${user.id}_${timestamp}_${uniqueIdentifier}.${extension}`
    return filename
  }

  async put(file: Express.Multer.File, user: User) {
    const filename = this.formatName(file, user)
    return await this.client.put(filename, file.buffer)
  }

  async get(filename: string, user: User) {
    try {
      this.mediaRepository.findOneOrFail({
        where:{filename, }
      })
    } catch {
      throw new UnauthorizedException()
    }
    

    return await this.client.get(filename)
  }
}
