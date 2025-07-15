import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:8082/reviews';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // o dal tuo AuthService
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review, {
      headers: this.getAuthHeaders()
    });
  }

  getReviewsByEvent(eventId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/event/${eventId}`);
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateReview(id: number, review: Review): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review, {
      headers: this.getAuthHeaders()
    });
  }
}
