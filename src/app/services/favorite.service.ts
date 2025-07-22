import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    let url = `${this.apiUrl}/${id}/details?`;
    if (requesterId) url += `requesterId=${requesterId}`;
    if (token) url += `&token=${token}`;
    return this.http.get<any>(url);
  }

  getPublicList(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/public/${token}`);
  }

  createList(list: FavoriteList, token: string): Observable<FavoriteList> {
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.post<FavoriteList>(this.apiUrl, list, { headers });
  }

  addEventsToList(id: number, eventIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/items`, eventIds);
  }

  removeItem(listId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${listId}/items/${itemId}`);
  }

  deleteList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  shareList(id: number, userIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/share`, userIds);
  }


  getFavorites(userId: number, token: string): Observable<number[]> {
    const headers = new HttpHeaders().set('Authorization', token);
    // Endpoint corretto dal controller:
    return this.http.get<number[]>(`${this.apiUrl}/user/${userId}/events`, { headers });
  }

  addToFavorites(userId: number, eventId: number, token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', token);
    // Endpoint corretto dal controller:
    return this.http.post<void>(`${this.apiUrl}/user/${userId}/events/${eventId}`, {}, { headers });
  }

  removeFromFavorites(userId: number, eventId: number, token: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', token);
    // Endpoint corretto dal controller:
    return this.http.delete<void>(`${this.apiUrl}/user/${userId}/events/${eventId}`, { headers });
  }

}
