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

  page = 0;
  size = 10;
  totalElements = 0;

  isOrganizer = false;
  showHideButton = false;

  currentSearchType: 'NONE' | 'NAME' | 'LOCATION' = 'NONE';

  constructor(
    private eventsService: EventService,
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = this.authService.getRole();
    this.isOrganizer = role === 'ORGANIZER';
    this.currentSearchType = 'NONE';
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
    let obs;

    if (this.currentSearchType === 'NAME' && this.searchName.trim()) {
      obs = this.eventsService.searchByNamePaged(this.searchName.trim(), this.page, this.size);
    } else if (this.currentSearchType === 'LOCATION' && this.searchLocation.trim()) {
      obs = this.eventsService.searchByLocationPaged(this.searchLocation.trim(), this.page, this.size);
    } else {
      obs = this.eventsService.getEventsPaged(this.page, this.size);
    }

    obs.subscribe({
      next: (response) => this.handlePagedResponse(response, reset),
      error: (err) => {
        console.error('Errore nel caricamento eventi:', err);
        this.isLoading = false;
      }
    });
  }

  private handlePagedResponse(response: Event[], reset: boolean): void {
    if (Array.isArray(response)) {
      if (reset) {
        this.events = response;
      } else {
        this.events = [...this.events, ...response];
      }
      // Se meno eventi di 'size' significa che non ce ne sono altri
      this.showHideButton = response.length === this.size;
    } else {
      // Per sicurezza, se arriva altro
      this.events = reset ? [] : this.events;
      this.showHideButton = false;
    }
    this.isLoading = false;
  }

  hideExtraEvents(): void {
    if (this.events.length > this.size) {
      this.events.splice(-this.size);
      this.page--;
      if (this.events.length <= this.size) {
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
      console.log(`Eliminazione evento ID: ${id}`);
      this.eventsService.deleteEvent(id).subscribe({
        next: () => {
          console.log(`Evento ID ${id} eliminato`);
          this.events = this.events.filter(e => e.id !== id);
          this.totalElements--;
        },
        error: (err) => {
          console.error('Errore eliminazione evento:', err);
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
      },
      error: (err) => {
        console.error('Errore durante la prenotazione:', err);
        alert('Errore durante la prenotazione. Riprova più tardi.');
      }
    });
  }



  loadMore(): void {
    if ((this.page + 1) * this.size >= this.totalElements) {
      console.log('Nessun altro evento da caricare');
      return; // niente da caricare
    }
    this.page++;
    console.log(`Carico pagina successiva: ${this.page}`);
    this.loadEvents(false); // carica senza resettare la lista
  }


  goToDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  updateEvent(event: Event): void {
    console.log('updateEvent chiamato per evento:', event);
    this.eventsService.updateEvent(event).subscribe({
      next: () => {

        this.events = this.events.map(e => e.id === event.id ? event : e);
        // Redirect alla pagina di modifica:
        this.router.navigate(['/events/edit', event.id]);
      },
      error: (err) => {
        console.error('Errore modifica evento:', err);
        if (err.status === 403) {
          alert('Non puoi modificare questo evento perché non sei l’organizer.');
        } else {
          alert('Errore durante la modifica dell\'evento. Riprova più tardi.');
        }
      }
    });
  }
}
