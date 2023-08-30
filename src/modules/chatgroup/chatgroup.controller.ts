import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatgroupService } from './chatgroup.service';
import { CreateChatgroupDto } from './dto/create-chatgroup.dto';
import { UpdateChatgroupDto } from './dto/update-chatgroup.dto';

@Controller('chatgroup')
export class ChatgroupController {
  constructor(private readonly chatgroupService: ChatgroupService) {}

 
}
