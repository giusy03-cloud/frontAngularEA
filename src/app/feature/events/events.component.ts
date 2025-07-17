import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-events',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  event?: Event;

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventById(+id).subscribe({
        next: (e) => {
          this.event = {
            ...e,
            startDate: new Date(e.startDate),
            endDate: new Date(e.endDate)
          };
        },
        error: (err) => {
          console.error('Errore caricamento evento:', err);
        }
      });
    }
  }
}
