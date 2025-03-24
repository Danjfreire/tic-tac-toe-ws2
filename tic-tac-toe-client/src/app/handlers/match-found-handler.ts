import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameStateService } from '../services/game-state.service';
import { MessageHandler, ServerMessage, MatchFoundMessage } from './message-handler.interface';

@Injectable({
  providedIn: 'root'
})
export class MatchFoundHandler implements MessageHandler {
  constructor(
    private gameState: GameStateService,
    private router: Router
  ) { }

  canHandle(message: ServerMessage): boolean {
    return message.type === 'match_found';
  }

  handle(message: ServerMessage): void {
    const matchFoundMessage = message as MatchFoundMessage;
    this.gameState.setCurrentMatch({
      matchId: matchFoundMessage.matchId,
      opponent: matchFoundMessage.opponent,
      symbol: matchFoundMessage.symbol
    });
    this.router.navigate(['/game']);
  }
}
