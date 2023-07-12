import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from "helmet";
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Xlxu系统管理后台')
    .setDescription('管理后台接口文档')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/apidoc', app, document); 
  Logger.debug('Swagger is available on: /apidoc');

  app.use(new ValidationPipe(
    {
      transform: true,
      whitelist: true,
      transformOptions:{
        enableImplicitConversion: true
      }
    }
  ))
  app.use(helmet());


  await app.listen(3000);
}
bootstrap();
