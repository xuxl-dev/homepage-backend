import { PartialType } from '@nestjs/swagger';
import { CreateChatgroupDto } from './create-chatgroup.dto';

export class UpdateChatgroupDto extends PartialType(CreateChatgroupDto) {}
