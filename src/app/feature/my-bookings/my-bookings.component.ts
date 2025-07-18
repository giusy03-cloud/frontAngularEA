import { Component, OnInit } from '@angular/core';

import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  standalone: true,
  styleUrls: ['./my-bookings.component.css'],
  imports: [CommonModule, RouterModule]
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  events: Event[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private eventService: EventService // aggiunto qui
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();  // metodo che restituisce userId loggato
    if (userId) {
      this.bookingService.getUserBookings(userId).subscribe({
        next: (bookings: Booking[]) => {
          this.bookings = bookings;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Errore nel caricamento delle prenotazioni';
          this.loading = false;
        }
      });

      // Carica gli eventi
      this.eventService.getEvents().subscribe({
        next: (events: Event[]) => {
          this.events = events;
        },
        error: (err) => {
          console.error('Errore nel caricamento degli eventi', err);
        }
      });
    } else {
      this.error = 'Utente non loggato';
      this.loading = false;
    }
  }

  deleteBooking(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
      console.log(`Utente ha confermato la cancellazione della prenotazione con id ${id}`);

      // Trova la prenotazione prima di eliminarla dalla lista
      const bookingDeleted = this.bookings.find(b => b.id === id);

      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          console.log(`Prenotazione con id ${id} eliminata con successo`);

          // Rimuovi la prenotazione dalla lista
          this.bookings = this.bookings.filter(b => b.id !== id);

          // Se trovi la prenotazione (prima dell'eliminazione), aggiorna la capacity evento
          if (bookingDeleted) {
            const event = this.events.find(e => e.id === bookingDeleted.eventId);
            if (event) {
              event.bookedCount = (event.bookedCount ?? 1) - 1; // Decrementa il numero di prenotazioni
              console.log(`Capacity evento ${event.id} aggiornata a ${event.bookedCount}`);
            }
          }

          alert('Prenotazione eliminata con successo');
        },
        error: (err) => {
          console.error('Errore durante l\'eliminazione della prenotazione:', err);
          alert('Errore durante l\'eliminazione della prenotazione');
        }
      });
    }
  }
}
