import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';


import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['booking.component.css']
})
export class BookingComponent implements OnInit {
  displayedColumns: string[] = ['id', 'userId', 'eventId', 'bookingTime'];
  dataSource = new MatTableDataSource<Booking>();

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        console.log('Dati ricevuti dal backend:', data); // <--- AGGIUNGI QUESTO
        this.dataSource.data = data;

        this.dataSource.filterPredicate = (booking: Booking, filter: string) => {
          const term = filter.trim().toLowerCase();
          return booking.id.toString().includes(term) ||
            booking.userId.toLowerCase().includes(term) ||
            booking.eventId.toLowerCase().includes(term);
        };
      },
      error: (err) => {
        console.error('Errore nel recupero delle prenotazioni:', err);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetFilter(input: HTMLInputElement): void {
    input.value = '';
    this.dataSource.filter = '';
  }
}
