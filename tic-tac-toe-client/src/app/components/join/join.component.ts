import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  standalone: true,
  imports: [FormsModule]
})
export class JoinComponent {
  nickname: string = '';

  constructor(private router: Router) { }

  onJoin(): void {
    if (this.nickname.trim()) {
      // TODO: Add actual server connection logic
      this.router.navigate(['/lobby']);
    }
  }
}
