import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatgroupService } from './chatgroup.service';
import { CreateChatgroupDto } from './dto/create-chatgroup.dto';
import { UpdateChatgroupDto } from './dto/update-chatgroup.dto';
import { JoinChatGroupDto } from './dto/join-chatgroup.dto';
import { AdminRole, UserRole } from '../auth/roles/roles.decorators';
import { IsAdmin, User } from '../common/decorator/decorators';
import { User as UserType } from '../user/entities/user.entity';
import { AddAdminDto } from './dto/add-admin-chatgroup.dto';

@Controller('chatgroup')
export class ChatgroupController {
  constructor(private readonly chatgroupService: ChatgroupService) { }

  @UserRole()
  @Post('create')
  async create(@Body() createChatgroupDto: CreateChatgroupDto, @User() user: UserType) {
    const group = await this.chatgroupService.create(createChatgroupDto)
    // add creator to group, set as admin
    await this.chatgroupService.join({ userId: user.id, groupId: group.id })

    return
  }

  @UserRole()
  @Post('update')
  update(@Body() updateChatgroupDto: UpdateChatgroupDto, @IsAdmin() isAdmin: boolean, @User() user: UserType) {
    // only admin can update group, or group admin can update group
    const isGroupAdmin = this.chatgroupService.isGroupAdmin(updateChatgroupDto.id, user.id);
    if (isAdmin || isGroupAdmin) {
      return this.chatgroupService.update(updateChatgroupDto.id, updateChatgroupDto);
    }
    throw new Error('only admin can update group');
  }

  @UserRole()
  @Post('add-admin')
  addAdmin(addAdminDto: AddAdminDto, @IsAdmin() isAdmin: boolean, @User() user: UserType) {
    // only admin can update group, or group admin can update group
    const isGroupAdmin = this.chatgroupService.isGroupAdmin(addAdminDto.groupId, user.id);
    if (isAdmin || isGroupAdmin) {
      return this.chatgroupService.addGroupAdmin(addAdminDto.groupId, addAdminDto.userId);
    }
    throw new Error('only admin can update group');
  }

  // @AdminRole()
  //TODO this is temporary, remove this
  @UserRole()
  @Post('all')
  findAll() {
    return this.chatgroupService.findAll();
  }
  
  @UserRole()
  @Post(':id')
  findGroup(@Param('id') id: string) {
    //TODO check if group is private
    return this.chatgroupService.findOne(+id);
  }

  @UserRole()
  @Post('join')
  joinGroup(@Body() joinChatGroupDto: JoinChatGroupDto) {
    //TODO check if user is already in group
    //TODO check if group is private
    return this.chatgroupService.join(joinChatGroupDto);
  }

  @UserRole()
  @Get('members/:id')
  getGroupMembers(@Param('id') id: string) {
    return this.chatgroupService.getMembers(+id);
  }
}
