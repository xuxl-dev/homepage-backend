import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InternalMessageService } from './internal-message.service';
import { CreateInternalMessageDto } from './dto/create-internal-message.dto';
import { UpdateInternalMessageDto } from './dto/update-internal-message.dto';

@Controller('internal-message')
export class InternalMessageController {
  constructor(private readonly internalMessageService: InternalMessageService) {}


}
