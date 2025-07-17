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

  constructor(
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEventsPaged(0, 15).subscribe({
      next: (events) => {
        this.events = events.map(e => ({
          ...e,
          startDate: new Date(e.startDate),
          endDate: new Date(e.endDate)
        }));
      },
      error: (err) => {
        console.error('Errore caricamento eventi per home:', err);
      }
    });
  }
  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextSlide(): void {
    if (this.currentIndex < this.events.length - this.maxVisible) {
      this.currentIndex++;
    }
  }

  goToDetails(eventId?: number): void {
    if (eventId !== undefined) {
      this.router.navigate(['/events', eventId]);
    }
  }
}
