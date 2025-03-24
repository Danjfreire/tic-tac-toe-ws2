import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Player {
  id: string;
  username: string;
}

export interface JoinMessage {
  type: 'join';
  username: string;
}

export interface JoinedMessage {
  type: 'joined';
  player: Player;
}

export interface FindMatchMessage {
  type: 'find_match';
  playerId: string;
}

export interface CancelMatchmakingMessage {
  type: 'cancel_matchmaking';
  playerId: string;
}

export interface MatchFoundMessage {
  type: 'match_found';
  matchId: string;
  opponent: Player;
  symbol: 'X' | 'O';
}

export interface PlayerCountMessage {
  type: 'player_count';
  count: number;
}

export type ServerMessage = JoinedMessage | PlayerCountMessage | MatchFoundMessage;
export type ClientMessage = JoinMessage | FindMatchMessage | CancelMatchmakingMessage;
export type Message = ClientMessage | ServerMessage;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public socket$: WebSocketSubject<Message>;
  public player$ = new BehaviorSubject<Player | null>(null);
  public playerCount$ = new BehaviorSubject<number>(0);
  public isMatchmaking$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.socket$ = webSocket('ws://localhost:3000');

    // Subscribe to messages to handle player count updates
    this.socket$.subscribe({
      next: (message: Message) => {
        if (message.type === 'player_count') {
          this.playerCount$.next(message.count);
        }
      }
    });
  }

  connect(username: string): Observable<Message> {
    const joinMessage: JoinMessage = {
      type: 'join',
      username: username
    };

    this.socket$.next(joinMessage);
    return this.socket$.asObservable();
  }

  disconnect() {
    this.socket$?.complete();
  }

  getPlayer(): Observable<Player | null> {
    return this.player$.asObservable();
  }

  getPlayerCount(): Observable<number> {
    return this.playerCount$.asObservable();
  }

  findMatch() {
    const player = this.player$.value;
    if (!player) return;

    const message: FindMatchMessage = {
      type: 'find_match',
      playerId: player.id
    };

    this.socket$.next(message);
    this.isMatchmaking$.next(true);
  }

  cancelMatchmaking() {
    const player = this.player$.value;
    if (!player) return;

    const message: CancelMatchmakingMessage = {
      type: 'cancel_matchmaking',
      playerId: player.id
    };

    this.socket$.next(message);
    this.isMatchmaking$.next(false);
  }
}