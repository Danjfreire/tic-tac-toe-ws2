import { Injectable } from '@angular/core';
import { GameStateService } from '../services/game-state.service';
import { MessageHandler, ServerMessage, PlayerCountMessage } from './message-handler.interface';

@Injectable({
  providedIn: 'root'
})
export class PlayerCountHandler implements MessageHandler {
  constructor(private gameState: GameStateService) { }

  canHandle(message: ServerMessage): boolean {
    return message.type === 'player_count';
  }

  handle(message: ServerMessage): void {
    const playerCountMessage = message as PlayerCountMessage;
    this.gameState.setPlayerCount(playerCountMessage.count);
  }
}
