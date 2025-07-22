import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/booking.model';
import { FavoriteService } from '../../../services/favorite.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  searchName = '';
  searchLocation = '';
  isLoading = false;
  isParticipant = false;
  isOrganizer = false;
  showHideButton = false;

  page = 0;
  size = 10;
  totalElements = 0;

  currentSearchType: 'NONE' | 'NAME' | 'LOCATION' = 'NONE';

  favoriteEventIds: Set<number> = new Set();
  isShowingFavorites = false;

  constructor(
    private eventsService: EventService,
    private authService: AuthService,
    private bookingService: BookingService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = this.authService.getRole();
    this.isOrganizer = role === 'ORGANIZER';
    this.isParticipant = role === 'PARTICIPANT';
    this.currentSearchType = 'NONE';

    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (this.isParticipant && userId && token) {
      this.favoriteService.getFavorites(userId, `Bearer ${token}`).subscribe({
        next: (favorites: number[]) => {
          this.favoriteEventIds = new Set(favorites);
        },
        error: (err:any) => {
          console.error('Errore caricamento preferiti:', err);
        }
      });
    }

    this.loadEvents(true);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }


  loadEvents(reset = true): void {
    if (reset) {
      this.page = 0;
      this.events = [];
    }

    this.isLoading = true;

    this.eventsService.getEventsPaged(this.page, this.size).subscribe({
      next: (response) => {
        if (reset) {
          this.events = response.content;
        } else {
          this.events = [...this.events, ...response.content];
        }

        this.totalElements = response.totalElements;

        this.events.forEach(event => {
          this.bookingService.getBookingCount(event.id!).subscribe({
            next: count => {
              event.bookedCount = count;
            },
            error: err => {
              console.error(`Errore nel caricare conteggio prenotazioni per evento ${event.id}`, err);
              event.bookedCount = 0;
            }
          });
        });

        // Mostra il pulsante Nascondi solo se siamo oltre la prima pagina
        this.showHideButton = this.page > 0;

        this.isLoading = false;
      },
      error: err => {
        console.error('Errore nel caricamento eventi:', err);
        this.isLoading = false;
      }
    });
  }


  private hasCapacity(event: Event): boolean {
    return (event.capacity ?? 0) > (event.bookedCount ?? 0);
  }

  hideExtraEvents(): void {
    if (this.page > 0) {
      this.events.splice(-this.size, this.size);
      this.page--;
      if (this.page === 0) {
        this.showHideButton = false;
      }
    }
  }

  searchByName(): void {
    if (!this.searchName.trim()) {
      this.currentSearchType = 'NONE';
      this.loadEvents(true);
      return;
    }

    this.currentSearchType = 'NAME';
    this.page = 0;
    this.events = [];
    this.loadEvents(true);
  }

  searchByLocation(): void {
    if (!this.searchLocation.trim()) {
      this.currentSearchType = 'NONE';
      this.loadEvents(true);
      return;
    }

    this.currentSearchType = 'LOCATION';
    this.page = 0;
    this.events = [];
    this.loadEvents(true);
  }

  deleteEvent(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questo evento?')) {
      this.eventsService.deleteEvent(id).subscribe({
        next: () => {
          this.events = this.events.filter(e => e.id !== id);
          this.totalElements--;
        },
        error: (err) => {
          if (err.status === 403) {
            alert('Non puoi eliminare questo evento perché non sei l’organizer.');
          } else {
            alert('Errore durante l\'eliminazione dell\'evento. Riprova più tardi.');
          }
        }
      });
    }
  }

  bookEvent(eventId: number): void {
    const event = this.events.find(e => e.id === eventId);
    if (!event) {
      alert('Evento non trovato.');
      return;
    }

    if (event.status === 'CANCELLED') {
      alert('Non puoi prenotare un evento cancellato.');
      return;
    }

    if (!this.hasCapacity(event)) {
      alert('Posti esauriti. Non puoi prenotare questo evento.');
      event.status = 'INACTIVE';
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      alert('Devi essere loggato per prenotare un evento.');
      return;
    }

    const booking: Booking = {
      userId: userId,
      eventId: eventId,
      bookingTime: new Date().toISOString()
    };

    this.bookingService.createBooking(booking).subscribe({
      next: () => {
        alert('Prenotazione effettuata con successo!');
        if (!event.bookings) event.bookings = [];
        event.bookings.push(booking);
        event.bookedCount = (event.bookedCount ?? 0) + 1;
        if (!this.hasCapacity(event)) event.status = 'INACTIVE';
      },
      error: (err) => {
        if (err.status === 400 && err.error === 'Posti esauriti per questo evento') {
          alert('Posti esauriti. Riprova più tardi.');
        } else {
          alert('Errore durante la prenotazione. Riprova più tardi.');
        }
      }
    });
  }

  loadMore(): void {
    if ((this.page + 1) * this.size >= this.totalElements) return;
    this.page++;
    this.loadEvents(false);
  }

  goToDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  updateEvent(event: Event): void {
    this.eventsService.updateEvent(event).subscribe({
      next: () => {
        this.events = this.events.map(e => e.id === event.id ? event : e);
        this.router.navigate(['/events/edit', event.id]);
      },
      error: (err) => {
        if (err.status === 403) {
          alert('Non puoi modificare questo evento perché non sei l’organizer.');
        } else {
          alert('Errore durante la modifica dell\'evento. Riprova più tardi.');
        }
      }
    });
  }



  toggleFavorite(event: Event): void {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (!userId || !token) {
      alert('Devi essere loggato per usare i preferiti.');
      return;
    }

    if (this.favoriteEventIds.has(event.id!)) {
      this.favoriteEventIds.delete(event.id!);
      this.favoriteService.removeFromFavorites(userId, event.id!, `Bearer ${token}`).subscribe({
        next: () => {
          console.log(`Evento ${event.id} rimosso dai preferiti.`);
          // Rimuovi evento anche dalla lista eventi visualizzati, se stai mostrando solo preferiti
          if (this.isShowingFavorites) {
            this.events = this.events.filter(e => e.id !== event.id);
            this.totalElements--;
          }
        },
        error: (err:any) => console.error('Errore rimozione preferito:', err)
      });
    } else {
      this.favoriteEventIds.add(event.id!);
      this.favoriteService.addToFavorites(userId, event.id!, `Bearer ${token}`).subscribe({
        next: () => console.log(`Evento ${event.id} aggiunto ai preferiti.`),
        error: (err:any) => console.error('Errore aggiunta preferito:', err)
      });
    }
  }


  isFavorite(event: Event): boolean {
    return this.favoriteEventIds.has(event.id!);
  }

  loadFavoriteEvents(): void {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (!userId || !token) {
      alert('Devi essere loggato per vedere i preferiti.');
      return;
    }

    this.isShowingFavorites = true;
    this.isLoading = true;

    this.favoriteService.getFavorites(userId, `Bearer ${token}`).subscribe({
      next: (favoriteIds: number[]) => {
        if (favoriteIds.length === 0) {
          this.events = [];
          this.isLoading = false;
          return;
        }

        // Usa EventService per caricare gli eventi dati gli ID

        this.eventsService.getEventsByIds(favoriteIds, `Bearer ${token}`).subscribe({
          next: (events) => {
            this.events = events;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Errore caricamento eventi preferiti:', err);
            this.isLoading = false;
          }
        });

      },
      error: (err) => {
        console.error('Errore caricamento preferiti:', err);
        this.isLoading = false;
      }
    });
  }
}
