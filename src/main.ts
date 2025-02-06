// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from './session/session.entity';
import { Logger } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import express from "express";
import { execSync } from 'child_process';  // 파일 복사를 위한 추가

async function bootstrap() {
  // 개발 시 views 폴더 복사
  if (process.env.NODE_ENV !== 'production') {
    execSync('cp -r src/views dist/src/views');  // 빌드할 때 views 폴더 복사
  }

  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 정적 파일 제공 설정
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('pug');
  app.setBaseViewsDir(join(__dirname, 'views'));  // 수정된 부분




  const logger = new Logger("App");

  const config = new DocumentBuilder()
  .setTitle('API 문서')
  .setDescription('NestJS API 설명서')
  .setVersion('1.0')
  .build();

  logger.log(`board http://localhost:8080/board`);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.SWAGGER_UI_PATH || 'docs', app, document);

  app.enableCors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });

  const dataSource = app.get(DataSource);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default-secret',
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        cleanupLimit: 2,
        limitSubquery: false,
        ttl: 86400,
      }).connect(dataSource.getRepository(SessionEntity)),
    }),
  );

  await app.listen(8080);
  logger.log('URL: http://localhost:8080/');
  logger.log('API 문서: http://localhost:8080/docs');
}

bootstrap();

// src/main.ts
