import { PartialType } from '@nestjs/swagger';
import { CreateThunderDto } from './create-thunder.dto';

export class UpdateThunderDto extends PartialType(CreateThunderDto) {}
