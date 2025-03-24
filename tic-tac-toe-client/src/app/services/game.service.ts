import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { MessageHandlerRegistry } from '../handlers/message-handler-registry';
import { ServerMessage } from '../handlers/message-handler.interface';
import { GameStateService } from './game-state.service';

export interface Player {
  id: string;
  username: string;
}

export interface Match {
  matchId: string;
  opponent: Player;
  symbol: 'X' | 'O';
}

export interface JoinMessage {
  type: 'join';
  username: string;
}

export interface FindMatchMessage {
  type: 'find_match';
  playerId: string;
}

export interface CancelMatchmakingMessage {
  type: 'cancel_matchmaking';
  playerId: string;
}

export type ClientMessage = JoinMessage | FindMatchMessage | CancelMatchmakingMessage;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket$: WebSocketSubject<ClientMessage | ServerMessage>;

  constructor(
    private messageHandlerRegistry: MessageHandlerRegistry,
    private gameState: GameStateService
  ) {
    this.socket$ = webSocket('ws://localhost:3000');
    this.socket$.subscribe({
      next: (message: any) => {
        if ('player' in message || 'count' in message || 'matchId' in message) {
          this.messageHandlerRegistry.handleMessage(message as ServerMessage);
        }
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      }
    });
  }

  connect(username: string): void {
    const joinMessage: JoinMessage = {
      type: 'join',
      username: username
    };
    this.socket$.next(joinMessage);
  }

  disconnect(): void {
    this.socket$?.complete();
  }

  findMatch(): void {
    const player = this.gameState.getCurrentPlayer();
    if (!player) return;

    const message: FindMatchMessage = {
      type: 'find_match',
      playerId: player.id
    };

    this.socket$.next(message);
    this.gameState.setMatchmaking(true);
  }

  cancelMatchmaking(): void {
    const player = this.gameState.getCurrentPlayer();
    if (!player) return;

    const message: CancelMatchmakingMessage = {
      type: 'cancel_matchmaking',
      playerId: player.id
    };

    this.socket$.next(message);
    this.gameState.setMatchmaking(false);
  }
}
