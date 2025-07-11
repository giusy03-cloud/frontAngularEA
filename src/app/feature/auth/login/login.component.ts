import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    CommonModule,RouterModule
  ],
  standalone: true
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}




  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        const role = this.authService.getRole(); // Ottieni il ruolo dall'authService

        if (role === 'ORGANIZER') {
          this.router.navigate(['/organizer-dashboard']);
        } else if (role === 'PARTICIPANT') {
          this.router.navigate(['/events']); // pagina con lista eventi da prenotare
        } else {
          // fallback, se vuoi
          this.router.navigate(['/home']);
        }
      },
      error: err => this.error = 'Username o password errati'
    });
  }



}
