import { Component } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], // ← lasciamo vuoto per ora o aggiungiamo CommonModule se serve
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    alert('Logout effettuato');
    this.router.navigate(['/']);
  }
}
