import { Injectable } from '@nestjs/common';
import { CreateUsermetaDto } from './dto/create-usermeta.dto';
import { UpdateUsermetaDto } from './dto/update-usermeta.dto';

@Injectable()
export class UsermetaService {
  create(createUsermetaDto: CreateUsermetaDto) {
    return 'This action adds a new usermeta';
  }

  findAll() {
    return `This action returns all usermeta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usermeta`;
  }

  update(id: number, updateUsermetaDto: UpdateUsermetaDto) {
    return `This action updates a #${id} usermeta`;
  }

  remove(id: number) {
    return `This action removes a #${id} usermeta`;
  }
}
