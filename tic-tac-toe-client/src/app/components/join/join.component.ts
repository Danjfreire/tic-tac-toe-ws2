import { Component } from '@angular/core';
import { GameService, Message } from '../../services/game.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-join',
  templateUrl: './join.component.html'
})
export class JoinComponent {
  username: string = '';

  constructor(
    private gameService: GameService,
    private router: Router
  ) { }

  onJoin() {
    if (this.username.trim()) {
      this.gameService.connect(this.username)
        .subscribe({
          next: (response: Message) => {
            if (response.type === 'joined') {
              // Store the player in the service
              this.gameService.player$.next(response.player);
              // Navigate to game page after successful join
              this.router.navigate(['/game']);
            }
          },
          error: (error) => {
            console.error('Connection error:', error);
          }
        });
    }
  }
}