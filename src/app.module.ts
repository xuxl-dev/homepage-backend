import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configGenerator from './config/config';
import { RedisModule } from './modules/db/redis/redis.module';
import { InternalMessageModule } from './modules/internal-message/internal-message.module';
import { GroupModule } from './modules/group/group.module';
import { OfflineMessageModule } from './modules/offline-message/offline-message.module';
import { AnnouncementModule } from './modules/announcement/announcement.module';
import { TaskflowModule } from './modules/taskflow/taskflow.module';
import { ThunderModule } from './modules/thunder/thunder.module';
import { ChatModule } from './modules/chat/chat.module';
import { ChatgroupModule } from './modules/chatgroup/chatgroup.module';
import { UsermetaModule } from './modules/usermeta/usermeta.module';
import { MailModule } from './modules/notification/mail/mail.module';
import { QqbotModule } from './modules/notification/qqbot/qqbot.module';
import { WechatbotModule } from './modules/notification/wechatbot/wechatbot.module';
import { SocketIoModule } from './modules/socket-io/socket-io.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModule } from './modules/media/media.module';
import { ChatsessModule } from './modules/chatsess/chatsess.module';

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
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          // autoLoadEntities: true,
          timezone: '+08:00',
          cache: {
            type: 'redis',
            options: {
              host: config.get('REDIS_HOST'),
              port: config.get('REDIS_PORT'),
              password: config.get('REDIS_PASSWORD'),
              db: config.get('REDIS_DB'),
            },
          },
          // migrationsTableName: "migrations",
          // migrations: ["migrations/*.ts"],
          // cli: {
          //   migrationsDir: "migrations"
          // }
        };
      },
    }),
    UserModule,
    RedisModule,
    InternalMessageModule,
    GroupModule,
    OfflineMessageModule,
    AnnouncementModule,
    TaskflowModule,
    ThunderModule,
    ChatModule,
    ChatgroupModule,
    UsermetaModule,
    MailModule,
    QqbotModule,
    WechatbotModule,
    SocketIoModule,
    CronModule,
    AuthModule,
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/'),
    MediaModule,
    ChatsessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
