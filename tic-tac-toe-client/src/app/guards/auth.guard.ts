import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
    const gameService = inject(GameService);
    const router = inject(Router);

    return gameService.getPlayer().pipe(
        map(player => {
            if (player) {
                return true;
            }

            return router.createUrlTree(['/join']);
        })
    );
};
