import { Injectable } from '@nestjs/common';
import { CreateSocietyDto } from './dto/create-society.dto';
import { UpdateSocietyDto } from './dto/update-society.dto';

@Injectable()
export class SocietyService {
  create(createSocietyDto: CreateSocietyDto) {
    return 'This action adds a new society';
  }

  findAll() {
    return `This action returns all society`;
  }

  findOne(id: number) {
    return `This action returns a #${id} society`;
  }

  update(id: number, updateSocietyDto: UpdateSocietyDto) {
    return `This action updates a #${id} society`;
  }

  remove(id: number) {
    return `This action removes a #${id} society`;
  }
}
