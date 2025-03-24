import { Routes } from '@angular/router';
import { JoinComponent } from './components/join/join.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { BoardComponent } from './components/board/board.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/join', pathMatch: 'full' },
  { path: 'join', component: JoinComponent },
  { path: 'lobby', component: LobbyComponent, canActivate: [authGuard] },
  { path: 'game', component: BoardComponent, canActivate: [authGuard] }
];
