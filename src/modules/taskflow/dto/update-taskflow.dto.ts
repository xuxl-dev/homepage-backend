import { PartialType } from '@nestjs/swagger';
import { CreateTaskflowDto } from './create-taskflow.dto';

export class UpdateTaskflowDto extends PartialType(CreateTaskflowDto) {}
