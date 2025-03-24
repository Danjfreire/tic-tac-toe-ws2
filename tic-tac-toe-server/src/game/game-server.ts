import { WebSocket } from 'ws';
import { v4 as uuid } from "uuid";

interface Player {
    id: string;
    username: string;
    socket: WebSocket;
}

export class GameServer {
    private players: Map<string, Player> = new Map();

    constructor() { }

    handleConnection(socket: WebSocket) {
        socket.on('message', (message: string) => {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'join':
                    this.handleJoin(socket, data.username);
                    break;
                default:
                    console.warn('Unknown message type:', data.type);
            }
        });

        socket.on('close', () => {
            this.handleDisconnect(socket);
        });
    }

    private broadcastPlayerCount() {
        const count = this.players.size;
        const message = JSON.stringify({
            type: 'player_count',
            count
        });

        // Broadcast to all connected players
        this.players.forEach(player => {
            player.socket.send(message);
        });
    }

    private handleJoin(socket: WebSocket, username: string) {
        const playerId = uuid();
        const player: Player = {
            id: playerId,
            username,
            socket
        };

        this.players.set(playerId, player);

        // Send joined confirmation
        socket.send(JSON.stringify({
            type: 'joined',
            player: {
                id: playerId,
                username
            }
        }));

        // Broadcast updated player count
        this.broadcastPlayerCount();
    }

    private handleDisconnect(socket: WebSocket) {
        for (const [id, player] of this.players.entries()) {
            if (player.socket === socket) {
                this.players.delete(id);
                // Broadcast updated player count after disconnect
                this.broadcastPlayerCount();
                break;
            }
        }
    }
} 