import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-status',
  templateUrl: './game-status.component.html',
  standalone: true
})
export class GameStatusComponent {
  @Input() xIsNext: boolean = true;
  @Input() winner: string | null = null;
} 