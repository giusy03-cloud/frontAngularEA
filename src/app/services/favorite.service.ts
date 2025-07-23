import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';  // aggiunto HttpParams
import { Observable } from 'rxjs';
import { FavoriteList } from '../models/favorite-list.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:8084/api/favorites'; // Cambia porta se necessario

  constructor(private http: HttpClient) {}

  getUserLists(userId: number): Observable<FavoriteList[]> {
    return this.http.get<FavoriteList[]>(`${this.apiUrl}/user/${userId}/visible`);
  }

  getListDetails(id: number, requesterId?: number, token?: string): Observable<any> {
    let params = new HttpParams();
    if (requesterId) params = params.set('requesterId', requesterId.toString());
    if (token) params = params.set('token', token);
    return this.http.get<any>(`${this.apiUrl}/${id}/details`, { params });
  }

  getPublicList(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/public/${token}`);
  }

  createList(list: FavoriteList, token: string): Observable<FavoriteList> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<FavoriteList>(this.apiUrl, list, { headers });
  }

  addEventsToList(id: number, eventIds: number[], token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.apiUrl}/${id}/items`, eventIds, { headers });
  }

  removeItem(listId: number, itemId: number, token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${listId}/items/${itemId}`, { headers });
  }

  deleteList(id: number, token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  shareList(id: number, userIds: number[], token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.apiUrl}/${id}/share`, userIds, { headers });
  }

  getFavorites(userId: number, token: string): Observable<number[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<number[]>(`${this.apiUrl}/user/${userId}/events`, { headers });
  }

  addToFavorites(userId: number, eventId: number, token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.apiUrl}/user/${userId}/events/${eventId}`, {}, { headers });
  }

  removeFromFavorites(userId: number, eventId: number, token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/user/${userId}/events/${eventId}`, { headers });
  }
}
