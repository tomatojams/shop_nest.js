// src/board/board.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('board')
export class Board {
  @PrimaryGeneratedColumn()
  id!: number;  // non-null assertion 사용

  @Column('text')
  title!: string;

  @CreateDateColumn({ type: 'timestamp' })
  date!: Date;
}
