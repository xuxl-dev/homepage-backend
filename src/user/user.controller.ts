import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorators';
import { noGuard, authedGuard } from 'src/auth/guards/guards.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @noGuard()
  @Post('register')
  register(@Body() createUser: CreateUserDto) {
    // console.log('createUser', createUser);
    return this.userService.register(createUser);
  }

  @authedGuard()
  @Post('current')
  //get current user
  async current( @Req() req ) {
    return req.user;
  }

  @authedGuard()
  @Get('usrinfo')
  getUserInfo(@Req() req) {
    return req.user;
  }

  @authedGuard()
  @Roles('admin')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @authedGuard()
  @Roles('user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @authedGuard()
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @authedGuard()
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
