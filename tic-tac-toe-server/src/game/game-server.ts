import { WebSocket } from 'ws';
import { v4 as uuid } from "uuid";
import { MessageHandlerRegistry } from './handlers/message-handler-registry';
import { GameMessage } from './handlers/message-handler.interface';

interface Player {
    id: string;
    username: string;
    socket: WebSocket;
    isMatchmaking?: boolean;
}

interface Match {
    id: string;
    playerX: Player;
    playerO: Player;
}

export class GameServer {
    private players: Map<string, Player> = new Map();
    private matches: Map<string, Match> = new Map();
    private matchmakingQueue: Player[] = [];
    private messageHandlerRegistry: MessageHandlerRegistry;

    constructor() {
        this.messageHandlerRegistry = new MessageHandlerRegistry();
    }

    handleConnection(socket: WebSocket) {
        socket.on('message', (message: string) => {
            const data: GameMessage = JSON.parse(message);
            const handler = this.messageHandlerRegistry.getHandler(data.type);

            if (handler) {
                handler.handle(this, socket, data);
            } else {
                console.warn('Unknown message type:', data.type);
            }
        });

        socket.on('close', () => {
            this.handleDisconnect(socket);
        });
    }

    // Methods needed by handlers
    addPlayer(player: Player): void {
        this.players.set(player.id, player);
    }

    getPlayer(playerId: string): Player | undefined {
        return this.players.get(playerId);
    }

    handleFindMatch(playerId: string): void {
        const player = this.players.get(playerId);
        if (!player) return;

        player.isMatchmaking = true;
        this.matchmakingQueue.push(player);
        this.tryCreateMatch();
    }

    handleCancelMatchmaking(playerId: string): void {
        const player = this.players.get(playerId);
        if (!player) return;

        player.isMatchmaking = false;
        this.matchmakingQueue = this.matchmakingQueue.filter(p => p.id !== playerId);
    }

    broadcastPlayerCount(): void {
        const count = this.players.size;
        const message = JSON.stringify({
            type: 'player_count',
            count
        });

        this.players.forEach(player => {
            player.socket.send(message);
        });
    }

    private tryCreateMatch(): void {
        if (this.matchmakingQueue.length >= 2) {
            const playerX = this.matchmakingQueue.shift()!;
            const playerO = this.matchmakingQueue.shift()!;

            const matchId = uuid();
            const match: Match = {
                id: matchId,
                playerX,
                playerO
            };

            this.matches.set(matchId, match);

            playerX.socket.send(JSON.stringify({
                type: 'match_found',
                matchId,
                opponent: {
                    id: playerO.id,
                    username: playerO.username
                },
                symbol: 'X'
            }));

            playerO.socket.send(JSON.stringify({
                type: 'match_found',
                matchId,
                opponent: {
                    id: playerX.id,
                    username: playerX.username
                },
                symbol: 'O'
            }));
        }
    }

    private handleDisconnect(socket: WebSocket): void {
        for (const [id, player] of this.players.entries()) {
            if (player.socket === socket) {
                this.players.delete(id);
                this.broadcastPlayerCount();
                break;
            }
        }
    }
} 