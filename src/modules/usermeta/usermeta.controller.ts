import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsermetaService } from './usermeta.service';
import { CreateUsermetaDto } from './dto/create-usermeta.dto';
import { UpdateUsermetaDto } from './dto/update-usermeta.dto';

@Controller('usermeta')
export class UsermetaController {
  constructor(private readonly usermetaService: UsermetaService) {}


}
