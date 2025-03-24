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

export type ServerMessage = JoinedMessage;
export type ClientMessage = JoinMessage;
export type Message = ClientMessage | ServerMessage;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket$: WebSocketSubject<Message>;
  public player$ = new BehaviorSubject<Player | null>(null);

  constructor() {
    this.socket$ = webSocket('ws://localhost:3000');
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
}