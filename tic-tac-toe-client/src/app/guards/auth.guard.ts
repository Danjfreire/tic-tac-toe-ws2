import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameStateService } from '../services/game-state.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
    const gameState = inject(GameStateService);
    const router = inject(Router);

    return gameState.getPlayer().pipe(
        map(player => {
            if (player) {
                return true;
            }

            return router.createUrlTree(['/join']);
        })
    );
};
