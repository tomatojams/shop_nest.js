
// src/board/board.controller.ts
import { Controller, Get, Render } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  @Render('board') // board.pug 렌더링
  async getBoard() {
    const boards = await this.boardService.findAll();
    return { board: boards }; // Pug 템플릿에 전달할 데이터
  }
}