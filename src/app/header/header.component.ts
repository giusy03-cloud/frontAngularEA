import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isLoginPage = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkState();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkState();
      }
    });
  }

  checkState() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.isLoginPage = this.router.url.startsWith('/auth/login');
  }

  logout() {
    this.authService.logout();
    alert('Logout effettuato');
    this.router.navigate(['/']);
  }
}
