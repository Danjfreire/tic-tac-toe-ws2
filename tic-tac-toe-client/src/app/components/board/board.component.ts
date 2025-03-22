import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class BoardComponent {
  squares: ('X' | 'O' | null)[] = Array(9).fill(null);
  xIsNext: boolean = true;
  winner: string | null = null;

  makeMove(idx: number): void {
    const symbol = this.xIsNext ? 'X' : 'O';
    if (!this.squares[idx] && !this.winner) {
      this.squares[idx] = symbol;
      this.xIsNext = !this.xIsNext;
      this.winner = this.isWinner(symbol) ? symbol : null;
    }
  }

  private isWinner(symbol: 'X' | 'O'): boolean {

    for (let line of WINNING_COMBINATIONS) {
      if (line.every(idx => this.squares[idx] === symbol)) {
        return true
      }
    }
    return false;
  }

  newGame(): void {
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
  }
} 