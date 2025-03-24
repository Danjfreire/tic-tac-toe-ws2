import { WebSocket } from 'ws';
import { GameServer } from '../game-server';

export interface GameMessage {
    type: string;
    [key: string]: any;
}

export interface MessageHandler {
    handle(server: GameServer, socket: WebSocket, message: GameMessage): void;
} 