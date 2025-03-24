import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-join',
  templateUrl: './join.component.html'
})
export class JoinComponent {
  username: string = '';

  constructor(private gameService: GameService) { }

  onJoin(): void {
    if (this.username.trim()) {
      this.gameService.connect(this.username);
    }
  }
}
