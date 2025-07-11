import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';
import {BookingService} from '../../../services/booking.service';
import {Booking} from '../../../models/booking.model';

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
  showHideButton=false;

  // Flag per capire se siamo in ricerca per nome o location, o lista completa
  currentSearchType: 'NONE' | 'NAME' | 'LOCATION' = 'NONE';

  constructor(
    private eventsService: EventService,
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}


  ngOnInit(): void {
    const role = this.authService.getRole();
    console.log('Ruolo utente:', role);
    this.isOrganizer = role === 'ORGANIZER';
    this.currentSearchType = 'NONE';
    console.log('Chiamo loadEvents da ngOnInit');
    this.loadEvents(true);
  }


  loadEvents(reset = true): void {
    if (reset) {
      this.page = 0;
      this.events = [];
    }

    this.isLoading = true;
    console.log(`Caricamento eventi, pagina: ${this.page}, size: ${this.size}`);
    if (this.currentSearchType === 'NAME' && this.searchName.trim()) {
      this.eventsService.searchByNamePaged(this.searchName.trim(), this.page, this.size).subscribe({
        next: (response) => {
          this.handlePagedResponse(response, reset);
        },
        error: (err) => {
          console.error('Errore nella ricerca per nome:', err);
          this.isLoading = false;
        }
      });
    }

    else if (this.currentSearchType === 'LOCATION' && this.searchLocation.trim()) {
      this.eventsService.searchByLocationPaged(this.searchLocation.trim(), this.page, this.size).subscribe({
        next: (response) => {
          this.handlePagedResponse(response, reset);
        },
        error: (err) => {
          console.error('Errore nel caricamento ricerca per location:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.eventsService.getEventsPaged(this.page, this.size).subscribe({
        next: (response) => {
          this.handlePagedResponse(response, reset);
        },
        error: (err) => {
          console.error('Errore nel caricamento eventi:', err);
          this.isLoading = false;
        }
      });
    }
  }

  private handlePagedResponse(response: { content: Event[], totalElements: number }, reset: boolean): void {
    console.log('Risposta ricevuta dal backend:', response);
    this.events = reset ? response.content : [...this.events, ...response.content];
    this.totalElements = response.totalElements;
    this.isLoading = false;
    console.log(`Eventi caricati totali: ${this.events.length} su ${this.totalElements}`);
    this.showHideButton = this.events.length > this.size;
  }


  hideExtraEvents(): void {
    if (this.events.length > this.size) {
      this.events.splice(-this.size); // Rimuove gli ultimi 10 eventi
      this.page--; // Torna alla pagina precedente

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
}
