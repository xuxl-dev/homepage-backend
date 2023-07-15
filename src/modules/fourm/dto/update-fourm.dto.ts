import { PartialType } from '@nestjs/swagger';
import { CreateFourmDto } from './create-fourm.dto';

export class UpdateFourmDto extends PartialType(CreateFourmDto) {}
