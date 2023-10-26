import { PartialType } from '@nestjs/swagger';
import { CreateChatsessDto } from './create-chatsess.dto';

export class UpdateChatsessDto extends PartialType(CreateChatsessDto) {}
