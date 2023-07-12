import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorators';
import { noGuard, authedGuard } from '../auth/guards/guards.guard';

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

  @Roles('user')
  @Post('current')
  //get current user
  async current( @Req() req ) {
    return req.user;
  }

  @Get('usrinfo')
  getUserInfo(@Req() req) {
    return req.user;
  }

  @Roles('admin')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles('user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }



  @Roles('user')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    // if user is admin
    // if user is not admin, he can only update himself

    if (req.user.role in ['admin', 'sa'] || req.user.id === +id) {
      return this.userService.update(+id, updateUserDto);
    }
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
