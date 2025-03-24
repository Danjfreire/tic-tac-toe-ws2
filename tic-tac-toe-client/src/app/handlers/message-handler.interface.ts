import { Player, Match } from '../services/game-state.service';

export interface GameMessage {
    type: string;
    [key: string]: any;
}

export interface JoinedMessage {
    type: 'joined';
    player: Player;
}

export interface PlayerCountMessage {
    type: 'player_count';
    count: number;
}

export interface MatchFoundMessage {
    type: 'match_found';
    matchId: string;
    opponent: Player;
    symbol: 'X' | 'O';
}

export type ServerMessage = JoinedMessage | PlayerCountMessage | MatchFoundMessage;

export interface MessageHandler {
    canHandle(message: ServerMessage): boolean;
    handle(message: ServerMessage): void;
}
