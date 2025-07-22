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
    console.log('Token usato per gli eventi:', token);
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  getEventsPaged(page: number, size: number): Observable<{ content: Event[], totalElements: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    const headers = this.getAuthHeaders();

    return this.http.get<{ content: Event[], totalElements: number }>(`${this.baseUrl}/paged`, { params, headers });
  }

  searchByNamePaged(name: string, page: number, size: number): Observable<{ content: Event[], totalElements: number }> {
    const params = new HttpParams()
      .set('name', name)
      .set('page', page.toString())
      .set('size', size.toString());
    const headers = this.getAuthHeaders();

    return this.http.get<{ content: Event[], totalElements: number }>(`${this.baseUrl}/search/byName`, { params, headers });
  }

  searchByLocationPaged(location: string, page: number, size: number): Observable<{ content: Event[], totalElements: number }> {
    const params = new HttpParams()
      .set('location', location)
      .set('page', page.toString())
      .set('size', size.toString());
    const headers = this.getAuthHeaders();

    return this.http.get<{ content: Event[], totalElements: number }>(`${this.baseUrl}/search/byLocation`, { params, headers });
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

  getAllEvents(): Observable<Event[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Event[]>(`${this.baseUrl}/all`, { headers });
  }


  getEventById(id: number): Observable<Event> {
    const headers = this.getAuthHeaders();
    return this.http.get<Event>(`${this.baseUrl}/${id}`, { headers });
  }

  getEvents(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}`, { headers });
  }

  getEventsByIds(ids: number[], token: string): Observable<Event[]> {
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.post<Event[]>(`${this.baseUrl}/byIds`, ids, { headers });
  }
}
