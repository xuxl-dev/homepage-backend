import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config'
import configGenerator from './config/config';
import { RedisModule } from './modules/db/redis/redis.module';
import { SocietyModule } from './modules/society/society.module';
import { CommentModule } from './modules/comment/comment.module';
import { FourmModule } from './modules/fourm/fourm.module';
import { InternalMessageModule } from './modules/internal-message/internal-message.module';
import { GroupModule } from './modules/group/group.module';
import { OfflineMessageModule } from './modules/offline-message/offline-message.module';
import { AnnouncementModule } from './modules/announcement/announcement.module';
import { TaskflowModule } from './modules/taskflow/taskflow.module';
import { ThunderModule } from './modules/thunder/thunder.module';
import { ChatModule } from './modules/chat/chat.module';
import { ChatgroupModule } from './modules/chatgroup/chatgroup.module';
import { UsermetaModule } from './modules/usermeta/usermeta.module';

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
    InternalMessageModule,
    GroupModule,
    OfflineMessageModule,
    AnnouncementModule,
    TaskflowModule,
    ThunderModule,
    ChatModule,
    ChatgroupModule,
    UsermetaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
