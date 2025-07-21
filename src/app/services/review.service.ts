import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Review {
  id?: number;
  userId: number;
  eventId: number;
  rating: number;
  comment: string;
  timestamp?: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiBase = 'http://localhost:8082/reviews';

  constructor(private http: HttpClient) {}

  getReviewsByEvent(eventId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiBase}/event/${eventId}`);
  }

  submitReview(review: Review): Observable<Review> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    return this.http.post<Review>(`${this.apiBase}`, review, { headers });
  }


  canUserReview(userId: number, eventId: number): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    return this.http.get<boolean>(`/api/reviews/can-review?userId=${userId}&eventId=${eventId}`, { headers });
  }

}
