// data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Board } from './src/board/board.entity';  // 엔티티 경로 설정
import { SessionEntity } from './src/session/session.entity';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();  // .env 파일 불러오기

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [path.resolve(__dirname, 'src/board/board.entity.ts'), path.resolve(__dirname, 'src/session/session.entity.ts')],
  migrations: [path.resolve(__dirname, 'src/migration/*.ts')],
  synchronize: false,
  logging: true,
});
