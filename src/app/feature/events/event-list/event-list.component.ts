import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../models/event.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';

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

  // Flag per capire se siamo in ricerca per nome o location, o lista completa
  currentSearchType: 'NONE' | 'NAME' | 'LOCATION' = 'NONE';

  constructor(
    private eventsService: EventService,
    private authService: AuthService,
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

      this.eventsService.getEventsPaged(this.page, this.size).subscribe({
        next: (response) => {
          console.log('Ricevuto risposta iniziale:', response);
          this.handlePagedResponse(response, reset);
        },
        error: (err) => {
          console.error('Errore caricamento eventi:', err);
          this.isLoading = false;
        }
      });

    } else if (this.currentSearchType === 'LOCATION' && this.searchLocation.trim()) {
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

  bookEvent(id: number): void {
    alert(`Funzione di prenotazione per evento ID ${id} non ancora implementata.`);
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
