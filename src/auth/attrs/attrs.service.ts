import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { AttrNode } from '../entities/attr.entity';

@Injectable()
export class AttrsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userService: UserService) { }

  async grant(id: number, node: object) {
    console.log('grant', id, node);
    if(!node['node']) return;

    const user = await this.userService.findOne(id);
    if (!user) {
      return;
    }
    this.addAttr(user, node['node'].split('.'));
    await this.userRepository.save(user);
  }

  addAttr(user: User, attr: string[]) {
    let cur = user.attributes.attribute;
    for (const node_idx in attr) {
      const node = attr[node_idx];
      if (!cur[node] && (+node_idx) !== attr.length - 1) {
        cur[node] = {};
        cur = cur[node] as AttrNode;
      } else if (!cur[node] && (+node_idx) === attr.length - 1) {
        cur[node] = true;
      }
    }
  }

  async getAttr(user_id) {
    return (await this.userService.findOne(user_id)).attributes.attribute;
  }
}
