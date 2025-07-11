import { Component } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import { Router } from '@angular/router';
import {User} from '../../../models/user.model';
import {FormsModule} from '@angular/forms';
import{CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  imports: [
    FormsModule,CommonModule,RouterModule
  ],
  standalone: true
})
export class RegistrationComponent {
  user: Partial<User> = {
    name: '',
    username: '',
    password: '',
    role: 'PARTICIPANT',
    accessType: 'NORMAL'
  };
  invitationCode: string = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (this.user.role === 'ORGANIZER') {
      this.user.invitationCode = this.invitationCode;
    }

    this.authService.register(this.user).subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: err => this.error = 'Registrazione fallita: ' + err.error
    });
  }
}
