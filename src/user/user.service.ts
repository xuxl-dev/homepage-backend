import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Attr } from 'src/auth/entities/attr.entity';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  
  async register(createUser: CreateUserDto) {
    // console.log('createUser', createUser);
    const { username } = createUser;
    const existUser = await this.usersRepository.findOne({
      where: { username },
    });
    
    if(existUser){
        throw new HttpException("user already exist", HttpStatus.BAD_REQUEST)
    }

    const newUser = this.usersRepository.create(createUser)
    const attr = new Attr();
    attr.attribute = {};
    newUser.attributes = Promise.resolve(attr);

    await this.usersRepository.save(newUser);
    return await this.usersRepository.findOne({where:{username}}) 
  } 

  async create(createUserDto: CreateUserDto) {

    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.email = createUserDto.email;

    const attr = new Attr();
    attr.attribute = {};
    user.attributes = Promise.resolve(attr);

    return await this.usersRepository.save(user);
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    return await this.usersRepository.find({
      skip: paginationQuery.offset,
      take: paginationQuery.limit,
    });
  }

  findOne(id: number) {
    if (isNaN(id)) throw new HttpException('id must be a number', HttpStatus.BAD_REQUEST);
    return this.usersRepository.findOne({ where: { id }});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    if (isNaN(id)) throw new HttpException('id must be a number', HttpStatus.BAD_REQUEST);
    const userexist = this.usersRepository.findOne({ where: { id }});
    if (userexist) {
      this.usersRepository.update(id, updateUserDto);
    } else {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
  }

  remove(id: number) {
    if (isNaN(id)) throw new HttpException('id must be a number', HttpStatus.BAD_REQUEST);
    const userexist = this.usersRepository.findOne({ where: { id }});
    if (userexist) {
      this.usersRepository.delete(id);
    } else {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
  }
}
