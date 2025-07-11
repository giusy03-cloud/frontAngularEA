import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}


  canActivate(): boolean {
    const allowed = this.auth.isAuthenticated();
    console.log('AuthGuard canActivate:', allowed);
    if (!allowed) {
      this.router.navigate(['/login']);
    }
    return allowed;
  }
}
