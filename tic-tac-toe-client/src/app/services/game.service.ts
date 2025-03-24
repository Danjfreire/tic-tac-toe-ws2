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

export interface PlayerCountMessage {
  type: 'player_count';
  count: number;
}

export type ServerMessage = JoinedMessage | PlayerCountMessage;
export type ClientMessage = JoinMessage;
export type Message = ClientMessage | ServerMessage;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket$: WebSocketSubject<Message>;
  public player$ = new BehaviorSubject<Player | null>(null);
  public playerCount$ = new BehaviorSubject<number>(0);

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
}