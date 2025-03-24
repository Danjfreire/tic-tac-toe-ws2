import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class LobbyComponent implements OnInit, OnDestroy {
  playerCount: number = 0;
  private subscription: Subscription | null = null;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.subscription = this.gameService.getPlayerCount()
      .subscribe(count => {
        this.playerCount = count;
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}