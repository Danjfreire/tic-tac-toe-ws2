import { WebSocket } from 'ws';
import { GameMessage, MessageHandler } from './message-handler.interface';
import { GameServer } from '../game-server';

export class FindMatchHandler implements MessageHandler {
    handle(server: GameServer, socket: WebSocket, message: GameMessage): void {
        const playerId = message.playerId;
        server.handleFindMatch(playerId);
    }
} 