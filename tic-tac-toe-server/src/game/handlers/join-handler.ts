import { WebSocket } from 'ws';
import { v4 as uuid } from "uuid";
import { GameMessage, MessageHandler } from './message-handler.interface';
import { GameServer } from '../game-server';

export class JoinHandler implements MessageHandler {
    handle(server: GameServer, socket: WebSocket, message: GameMessage): void {
        const playerId = uuid();
        const username = message.username;

        server.addPlayer({
            id: playerId,
            username,
            socket
        });

        socket.send(JSON.stringify({
            type: 'joined',
            player: {
                id: playerId,
                username
            }
        }));

        server.broadcastPlayerCount();
    }
} 