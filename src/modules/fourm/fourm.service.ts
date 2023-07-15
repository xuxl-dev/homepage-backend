import { Injectable } from '@nestjs/common';
import { CreateFourmDto } from './dto/create-fourm.dto';
import { UpdateFourmDto } from './dto/update-fourm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fourm } from './entities/fourm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FourmService {

  constructor(@InjectRepository(Fourm)
    private readonly fourmRepository: Repository<Fourm>
  ) {}

  create(createFourmDto: CreateFourmDto) {
    return 'This action adds a new fourm';
  }

  findAll() {
    return `This action returns all fourm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fourm`;
  }

  update(id: number, updateFourmDto: UpdateFourmDto) {
    return `This action updates a #${id} fourm`;
  }

  remove(id: number) {
    return `This action removes a #${id} fourm`;
  }
}
