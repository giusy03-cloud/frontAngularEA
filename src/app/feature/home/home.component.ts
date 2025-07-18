import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [EventService, DatePipe]
})
export class HomeComponent implements OnInit {
  events: Event[] = [];
  currentIndex = 0;
  maxVisible = 10;

  totalEventsAvailable = 0;  // tot eventi sul server
  page = 0;
  size = 10;

  showLoadMorePrompt = false;  // mostra messaggio per caricare altri

  constructor(
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(reset = true): void {
    if (reset) {
      this.page = 0;
      this.events = [];
      this.currentIndex = 0;
      this.showLoadMorePrompt = false;
    }

    this.eventService.getEventsPaged(this.page, this.size).subscribe({
      next: (response) => {
        this.totalEventsAvailable = response.totalElements;
        this.events = reset
          ? response.content.map(e => ({ ...e, startDate: new Date(e.startDate), endDate: new Date(e.endDate) }))
          : [...this.events, ...response.content.map(e => ({ ...e, startDate: new Date(e.startDate), endDate: new Date(e.endDate) }))];
      },
      error: (err) => {
        console.error('Errore caricamento eventi per home:', err);
      }
    });
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.showLoadMorePrompt = false; // nascondi messaggio se torni indietro
    }
  }

  // gestione clic su freccia destra
  onNextClick(): void {
    if (this.currentIndex < this.events.length - this.maxVisible) {
      this.currentIndex++;
      this.showLoadMorePrompt = false; // nascondi messaggio se scorri normalmente
    } else if (this.events.length < this.totalEventsAvailable) {
      // Sei alla fine e ci sono altri eventi da caricare
      this.showLoadMorePrompt = true; // mostra messaggio per caricare altri eventi
    }
    // altrimenti siamo alla fine e non ci sono altri eventi, non fare nulla
  }

  loadMore(): void {
    this.page++;
    this.showLoadMorePrompt = false;
    this.loadEvents(false);
  }

  dismissLoadMorePrompt(): void {
    this.showLoadMorePrompt = false;
  }

  goToDetails(eventId?: number): void {
    if (eventId !== undefined) {
      this.router.navigate(['/events', eventId]);
    }
  }
}
