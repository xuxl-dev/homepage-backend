import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OfflineMessageService } from './offline-message.service';

@Controller('offline-message')
export class OfflineMessageController {
  constructor(private readonly offlineMessageService: OfflineMessageService) {}
}
