import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:8081/events';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  getEventsPaged(page: number, size: number): Observable<Event[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    // No headers perché endpoint pubblico
    return this.http.get<Event[]>(`${this.baseUrl}/paged`, { params });
  }



  searchByNamePaged(name: string, page: number, size: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/search/byName`, { params: { name } });
  }

  searchByLocationPaged(location: string, page: number, size: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/search/byLocation`, { params: { location } });
  }

  createEvent(event: Event): Observable<Event> {
    const headers = this.getAuthHeaders();
    return this.http.post<Event>(`${this.baseUrl}/create`, event, { headers });
  }

  updateEvent(event: Event): Observable<Event> {
    const headers = this.getAuthHeaders();
    return this.http.put<Event>(`${this.baseUrl}/update/${event.id}`, event, { headers });
  }

  deleteEvent(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { headers });
  }
/*
  getAllEvents(): Observable<Event[]> {
    const headers = this.getAuthHeaders(); // se serve autorizzazione
    return this.http.get<Event[]>(`${this.baseUrl}/all`, { headers });
  }
*/

  getAllEvents(): Observable<Event[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Event[]>(this.baseUrl, { headers });
  }

  getEventById(id: number): Observable<Event> {
    const headers = this.getAuthHeaders();
    return this.http.get<Event>(`${this.baseUrl}/${id}`, { headers });
  }

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
}
