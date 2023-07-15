import { Module } from '@nestjs/common';
import { FourmService } from './fourm.service';
import { FourmController } from './fourm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fourm } from './entities/fourm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fourm])],
  controllers: [FourmController],
  providers: [FourmService]
})
export class FourmModule {}
