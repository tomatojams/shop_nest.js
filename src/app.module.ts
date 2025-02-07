// src/app.module.ts

// 모듈은 NestJS의 핵심 개념으로, 관련된 기능(컨트롤러, 서비스, 프로바이더 등)을 하나의 그룹으로 묶는 역할

// NestJS의 필수 모듈 가져오기
import { Module } from '@nestjs/common';        // 모듈 데코레이터
import { ConfigModule } from '@nestjs/config';  // 환경 변수(.env) 로드 모듈
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeORM 모듈 (DB 연결)
import { BoardModule } from './board/board.module'; // 게시판 관련 모듈
import { SessionEntity } from './session/session.entity'; // 세션 엔티티 (DB 테이블)


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // .env 파일을 글로벌로 불러오기
    BoardModule,                               // 게시판 모듈(기능 확장)
    TypeOrmModule.forRoot({                    // DB 연결 설정 (MySQL)
      type: 'mysql',
      host: process.env.DB_HOST,               // 환경 변수에서 DB 호스트 가져오기
      port: parseInt(process.env.DB_PORT || '3306', 10), // 포트 설정 (기본값 3306)
      username: process.env.DB_USERNAME,       // DB 사용자 이름
      password: process.env.DB_PASSWORD,       // DB 비밀번호
      database: process.env.DB_DATABASE,       // 사용할 DB 이름
      entities: [__dirname + '/**/*.entity{.ts,.js}'],  // 엔티티 자동 탐색
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'false', // DB 동기화 여부 (테이블 자동 생성)
      logging: process.env.TYPEORM_LOGGING === 'true',  // 쿼리 로깅 여부
    }),
    TypeOrmModule.forFeature([SessionEntity]),  // 세션 엔티티를 TypeORM에 등록
  ],
})
export class AppModule {}

