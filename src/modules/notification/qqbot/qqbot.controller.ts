import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QqbotService } from './qqbot.service';
import { CreateQqbotDto } from './dto/create-qqbot.dto';
import { UpdateQqbotDto } from './dto/update-qqbot.dto';

@Controller('qqbot')
export class QqbotController {
  constructor(private readonly qqbotService: QqbotService) {}
}
