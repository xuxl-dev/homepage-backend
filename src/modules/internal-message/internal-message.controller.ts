import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InternalMessageService } from './internal-message.service';

@Controller('internal-message')
export class InternalMessageController {
  constructor(private readonly internalMessageService: InternalMessageService) {}


}
