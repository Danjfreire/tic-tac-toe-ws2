import { Routes } from '@angular/router';
import { JoinComponent } from './components/join/join.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { BoardComponent } from './components/board/board.component';

export const routes: Routes = [
  { path: '', redirectTo: '/join', pathMatch: 'full' },
  { path: 'join', component: JoinComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'game', component: BoardComponent }
];
