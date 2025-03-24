import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameStateService } from '../services/game-state.service';
import { MessageHandler, ServerMessage, JoinedMessage } from './message-handler.interface';

@Injectable({
  providedIn: 'root'
})
export class JoinedHandler implements MessageHandler {
  constructor(
    private gameState: GameStateService,
    private router: Router
  ) { }

  canHandle(message: ServerMessage): boolean {
    return message.type === 'joined';
  }

  handle(message: ServerMessage): void {
    const joinedMessage = message as JoinedMessage;
    this.gameState.setPlayer(joinedMessage.player);
    this.router.navigate(['/lobby']);
  }
}
