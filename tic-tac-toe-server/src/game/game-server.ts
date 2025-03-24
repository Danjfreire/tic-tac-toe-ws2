import { WebSocket } from 'ws';
import { v4 as uuid } from "uuid";

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

    constructor() { }

    handleConnection(socket: WebSocket) {
        socket.on('message', (message: string) => {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'join':
                    this.handleJoin(socket, data.username);
                    break;
                case 'find_match':
                    this.handleFindMatch(data.playerId);
                    break;
                case 'cancel_matchmaking':
                    this.handleCancelMatchmaking(data.playerId);
                    break;
                default:
                    console.warn('Unknown message type:', data.type);
            }
        });

        socket.on('close', () => {
            this.handleDisconnect(socket);
        });
    }

    private handleFindMatch(playerId: string) {
        const player = this.players.get(playerId);
        if (!player) return;

        player.isMatchmaking = true;
        this.matchmakingQueue.push(player);

        // Check if we can create a match
        this.tryCreateMatch();
    }

    private handleCancelMatchmaking(playerId: string) {
        const player = this.players.get(playerId);
        if (!player) return;

        player.isMatchmaking = false;
        this.matchmakingQueue = this.matchmakingQueue.filter(p => p.id !== playerId);
    }

    private tryCreateMatch() {
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

            // Notify both players
            const matchFoundMessage = JSON.stringify({
                type: 'match_found',
                matchId,
                opponent: null // We'll fill this for each player
            });

            // Send to player X
            playerX.socket.send(JSON.stringify({
                type: 'match_found',
                matchId,
                opponent: {
                    id: playerO.id,
                    username: playerO.username
                },
                symbol: 'X'
            }));

            // Send to player O
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