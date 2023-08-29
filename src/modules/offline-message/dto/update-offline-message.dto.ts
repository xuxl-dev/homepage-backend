import { PartialType } from '@nestjs/swagger';
import { CreateOfflineMessageDto } from './create-offline-message.dto';

export class UpdateOfflineMessageDto extends PartialType(CreateOfflineMessageDto) {}
