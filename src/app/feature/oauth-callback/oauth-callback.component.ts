import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  templateUrl: './oauth-callback.component.html'
})
export class OauthCallbackComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}


  ngOnInit() {

    this.http.get<any>('http://localhost:8080/api/users/me/oauth', {
      withCredentials: true // <-- necessario per cookie di sessione
    }).subscribe({
      next: (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        const role = userData.role || 'PARTICIPANT';
        this.router.navigate([role === 'ORGANIZER' ? '/organizer-dashboard' : '/events']);
      },
      error: (err) => {
        console.error('Errore nel recuperare i dati utente:', err);
        this.router.navigate(['/auth/login']);
      }
    });

  }

}
