import { PartialType } from '@nestjs/swagger';
import { CreateQqbotDto } from './create-qqbot.dto';

export class UpdateQqbotDto extends PartialType(CreateQqbotDto) {}
