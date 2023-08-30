import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OfflineMessageService } from './offline-message.service';
import { CreateOfflineMessageDto } from './dto/create-offline-message.dto';
import { UpdateOfflineMessageDto } from './dto/update-offline-message.dto';

@Controller('offline-message')
export class OfflineMessageController {
  constructor(private readonly offlineMessageService: OfflineMessageService) {}

 
}
