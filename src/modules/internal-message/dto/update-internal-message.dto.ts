import { PartialType } from '@nestjs/swagger';
import { CreateInternalMessageDto } from './create-internal-message.dto';

export class UpdateInternalMessageDto extends PartialType(CreateInternalMessageDto) {}
