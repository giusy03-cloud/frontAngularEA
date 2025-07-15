import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Booking} from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://localhost:8083/api/bookings'; // porta backend

  constructor(private http: HttpClient) {}

  createBooking(booking: Booking): Observable<any> {
    const token = localStorage.getItem('token'); // oppure tramite AuthService
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.baseUrl, booking, { headers, responseType: 'text' }); // responseType è opzionale
  }

  getAllBookings(): Observable<Booking[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Booking[]>(this.baseUrl, { headers });
  }

  getBookingsByUser(userId: number): Observable<Booking[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Booking[]>(`${this.baseUrl}/user/${userId}`, { headers });
  }





}
