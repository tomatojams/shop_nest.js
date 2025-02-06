// src/board/board.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board } from './board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}