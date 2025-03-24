import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class LobbyComponent implements OnInit, OnDestroy {
  playerCount: number = 0;
  isMatchmaking: boolean = false;
  searchTime: number = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.gameService.getPlayerCount().subscribe(count => {
        this.playerCount = count;
      }),

      this.gameService.isMatchmaking$.subscribe(isSearching => {
        this.isMatchmaking = isSearching;
        if (isSearching) {
          // Start the timer
          this.searchTime = 0;
          this.subscriptions.push(
            interval(1000).subscribe(() => {
              this.searchTime++;
            })
          );
        }
      }),

      this.gameService.socket$.subscribe(message => {
        if (message.type === 'match_found') {
          this.router.navigate(['/game']);
        }
      })
    );
  }

  findMatch() {
    this.gameService.findMatch();
  }

  cancelMatchmaking() {
    this.gameService.cancelMatchmaking();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}