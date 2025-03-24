import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { GameStateService } from '../../services/game-state.service';
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
    private gameState: GameStateService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.gameState.getPlayerCount().subscribe(count => {
        this.playerCount = count;
      }),

      this.gameState.getMatchmaking().subscribe(isSearching => {
        this.isMatchmaking = isSearching;
        if (isSearching) {
          this.searchTime = 0;
          this.subscriptions.push(
            interval(1000).subscribe(() => {
              this.searchTime++;
            })
          );
        }
      })
    );
  }

  findMatch(): void {
    this.gameService.findMatch();
  }

  cancelMatchmaking(): void {
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
