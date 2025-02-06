import { Controller, Get, Render } from '@nestjs/common';
import { BoardService } from './board/board.service';

@Controller()
export class AppController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/')
  @Render('index')  // templates/index.pug 파일 렌더링
  index() {
    return {};
  }

  @Get('/about')
  about(): string {
    return '그거야';
  }

  @Get('/board')
  @Render('board')
  async board() {
    const boards = await this.boardService.findAll();
    return { board: boards };
  }

  @Get('/date')
  time(): string {
    return new Date().toISOString();
  }

  // 새로운 getHello 메서드 추가
  getHello(): string {
    return 'Hello World!';
  }
}
