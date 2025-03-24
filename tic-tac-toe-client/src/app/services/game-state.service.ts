import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Player {
    id: string;
    username: string;
}

export interface Match {
    matchId: string;
    opponent: Player;
    symbol: 'X' | 'O';
}

@Injectable({
    providedIn: 'root'
})
export class GameStateService {
    private player$ = new BehaviorSubject<Player | null>(null);
    private playerCount$ = new BehaviorSubject<number>(0);
    private isMatchmaking$ = new BehaviorSubject<boolean>(false);
    private currentMatch$ = new BehaviorSubject<Match | null>(null);

    setPlayer(player: Player | null): void {
        this.player$.next(player);
    }

    getPlayer(): Observable<Player | null> {
        return this.player$.asObservable();
    }

    getCurrentPlayer(): Player | null {
        return this.player$.value;
    }

    setPlayerCount(count: number): void {
        this.playerCount$.next(count);
    }

    getPlayerCount(): Observable<number> {
        return this.playerCount$.asObservable();
    }

    setMatchmaking(isMatchmaking: boolean): void {
        this.isMatchmaking$.next(isMatchmaking);
    }

    getMatchmaking(): Observable<boolean> {
        return this.isMatchmaking$.asObservable();
    }

    setCurrentMatch(match: Match | null): void {
        this.currentMatch$.next(match);
    }

    getCurrentMatch(): Observable<Match | null> {
        return this.currentMatch$.asObservable();
    }
}
