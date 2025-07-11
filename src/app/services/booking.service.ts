import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://localhost:8083/api/bookings';

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<Booking[]> {
    const token = localStorage.getItem('token'); // o dove tieni il token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Booking[]>(this.baseUrl, { headers });
  }

}
