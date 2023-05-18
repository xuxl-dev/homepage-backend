import { Injectable, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStorage } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStorage } from './jwt.strategy';
import { AttrsModule } from './attrs/attrs.module';
import { CacheService } from '../db/redis/cache.service';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
  }),
}); 

@Module({
  imports: [TypeOrmModule.forFeature([User]),  PassportModule, ConfigModule, jwtModule, AttrsModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStorage, JwtStorage, CacheService],
  exports: [jwtModule],
})

export class AuthModule {}
