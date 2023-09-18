import { Controller } from '@nestjs/common';
import { OfflineMessageService } from './offline-message.service';

@Controller('offline-message')
export class OfflineMessageController {
  constructor(private readonly offlineMessageService: OfflineMessageService) {}
}
