import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class OrganizerGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.auth.isAuthenticated();
    const isOrganizer = this.auth.getRole() === 'ORGANIZER';

    console.log('OrganizerGuard - isLoggedIn:', isLoggedIn, 'isOrganizer:', isOrganizer);

    if (!isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (!isOrganizer) {
      this.router.navigate(['/home']); // o altra pagina "non autorizzato"
      return false;
    }

    return true;
  }
}
