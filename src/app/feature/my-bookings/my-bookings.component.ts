import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  standalone: true,
  styleUrls: ['./my-bookings.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  events: Event[] = [];
  loading = true;
  error: string | null = null;

  searchTerm = '';
  filter = 'all'; // 'all', 'past', 'upcoming'

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      // Prende solo le prenotazioni dell’utente loggato
      this.bookingService.getUserBookings(userId).subscribe({
        next: (bookings: Booking[]) => {
          this.bookings = bookings;
          this.loading = false;
        },
        error: () => {
          this.error = 'Errore nel caricamento delle prenotazioni';
          this.loading = false;
        }
      });

      // Carica tutti gli eventi per recuperare info utili (nome, data ecc.)
      this.eventService.getAllEvents().subscribe({
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

  getEventName(eventId: number): string {
    const event = this.events.find(e => e.id === eventId);
    return event?.name ?? 'Evento sconosciuto';
  }

  getEventDate(eventId: number): string {
    const event = this.events.find(e => e.id === eventId);
    return event?.startDate ? new Date(event.startDate).toLocaleString() : 'Data sconosciuta';
  }

  isEventPast(eventId: number): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (!event?.startDate) return false;
    const eventDate = new Date(event.startDate);
    const now = new Date();
    return eventDate < now;
  }

  filteredBookings(): Booking[] {
    return this.bookings.filter(booking => {
      const event = this.events.find(e => e.id === booking.eventId);
      if (!event) return false;

      const matchesSearch = event.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const eventDate = new Date(event.startDate);
      const now = new Date();

      const isPast = eventDate < now;
      const isUpcoming = eventDate >= now;

      if (this.filter === 'past' && !isPast) return false;
      if (this.filter === 'upcoming' && !isUpcoming) return false;

      return matchesSearch;
    });
  }

  deleteBooking(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
      const bookingDeleted = this.bookings.find(b => b.id === id);

      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          this.bookings = this.bookings.filter(b => b.id !== id);

          if (bookingDeleted) {
            const event = this.events.find(e => e.id === bookingDeleted.eventId);
            if (event) {
              event.bookedCount = (event.bookedCount ?? 1) - 1;
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

  goToReview(eventId: number): void {
    this.router.navigate(['/events', eventId, 'review']);
  }
}
