import { Component } from '@angular/core';
import { BoardComponent } from './components/board/board.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [BoardComponent]
})
export class AppComponent {
  title = 'Tic Tac Toe';
}
