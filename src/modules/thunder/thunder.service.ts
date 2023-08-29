import { Injectable } from '@nestjs/common';
import { CreateThunderDto } from './dto/create-thunder.dto';
import { UpdateThunderDto } from './dto/update-thunder.dto';

@Injectable()
export class ThunderService {
  create(createThunderDto: CreateThunderDto) {
    return 'This action adds a new thunder';
  }

  findAll() {
    return `This action returns all thunder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thunder`;
  }

  update(id: number, updateThunderDto: UpdateThunderDto) {
    return `This action updates a #${id} thunder`;
  }

  remove(id: number) {
    return `This action removes a #${id} thunder`;
  }
}
