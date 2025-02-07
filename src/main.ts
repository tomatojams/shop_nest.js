// src/main.ts

// NestJS core 모듈 및 앱 모듈
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

// Swagger API 문서화 모듈
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// 세션 관리 및 DB 저장 모듈
import session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from './session/session.entity';

// 로깅 및 Express 설정
import { Logger } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import express from "express";
import { execSync } from 'child_process'; // 복사

async function bootstrap() {
  // 개발 환경일 경우 views 폴더 복사 (빌드 시 필요)
  if (process.env.NODE_ENV !== 'production') {
    execSync('cp -r src/views dist/src/views');
  }

  // NestJS 애플리케이션을 Express 기반으로 생성
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 정적 파일 제공 및 뷰 엔진 설정
  const root = process.cwd();
  app.use(express.static(join(root, 'public')));  // public 폴더의 정적 파일 제공
  app.setViewEngine('pug');                       // Pug 템플릿 엔진 설정
  app.setBaseViewsDir(join(__dirname, 'views'));  // 뷰 파일 경로 설정

  // 로거 인스턴스 생성
  const logger = new Logger("App");

  // Swagger 설정 (API 문서화)
  const config = new DocumentBuilder()
  .setTitle('API 문서')
  .setDescription('NestJS API 설명서')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.SWAGGER_UI_PATH || 'docs', app, document);

  // CORS 설정 (모든 출처 허용 및 쿠키 사용 가능)
  app.enableCors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });

  // 세션 저장소 설정 (TypeORM을 이용해 DB에 세션 저장)
  const dataSource = app.get(DataSource);
  app.use(
      session({
        secret: process.env.SESSION_SECRET || 'default-secret',  // 세션 암호화 키
        resave: false,                                           // 세션 재저장 방지
        saveUninitialized: false,                                // 초기화되지 않은 세션 저장 방지
        store: new TypeormStore({
          cleanupLimit: 2,     // 오래된 세션 자동 정리
          limitSubquery: false,
          ttl: 86400,          // 세션 만료 시간 (초 단위, 24시간)
        }).connect(dataSource.getRepository(SessionEntity)),
      }),
  );

  // 서버 실행 (8080 포트)
  await app.listen(8080);
  logger.log('URL: http://localhost:8080/');
  logger.log('API 문서: http://localhost:8080/docs');
}

bootstrap();
