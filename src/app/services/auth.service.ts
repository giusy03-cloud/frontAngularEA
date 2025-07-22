import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080'; // URL backend Auth
  private tokenKey = 'token';
  private userKey = 'user';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.userKey, JSON.stringify(res.user));
      })
    );
  }

  register(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/users`, user);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  /*
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

   */


  getRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }


  // Dentro AuthService
  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ORGANIZER';
  }

  getUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== undefined && token.trim() !== '';
  }









}
