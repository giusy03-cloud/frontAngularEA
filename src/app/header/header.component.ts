import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {AuthService} from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public auth: AuthService, protected router: Router) {}

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }



  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  // Getter per sapere se l'utente è autenticato
  get isLoggedIn(): boolean {
    return this.auth.isAuthenticated();
  }

  // Getter per sapere se è admin
  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  get isOrganizer(): boolean {
    return this.auth.getRole() === 'ORGANIZER';
  }

}
