import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config'
import configGenerator from './config/config';
import { RedisModule } from './db/redis/redis.module';
import { SocietyModule } from './society/society.module';
import { CommentModule } from './comment/comment.module';
import { FourmModule } from './fourm/fourm.module';

@Module({
  imports: [
    configGenerator(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          database: config.get('DB_DATABASE'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          synchronize: config.get('DB_SYNC'),
          entities: [
            __dirname + '/**/*.entity{.ts,.js}'
          ],
          // autoLoadEntities: true,
          timezone: '+08:00',
          // migrationsTableName: "migrations",
          // migrations: ["migrations/*.ts"],
          // cli: {
          //   migrationsDir: "migrations"
          // }
        };
      },
    }),
    UserModule,
    AuthModule,
    RedisModule,
    SocietyModule,
    CommentModule,
    FourmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
