import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { BookingService } from '../../../services/booking.service';
import { Event } from '../../../models/event.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class EventDetailsComponent implements OnInit {
  event?: Event;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private bookingService: BookingService,
    private location: Location,
    private router: Router
  ) {}

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventById(+id).subscribe({
        next: (data) => {
          this.event = data;
        },
        error: (err) => {
          console.error('Errore nel caricamento evento:', err);
        }
      });
    }
  }

  bookEvent(): void {
    if (!this.authService.isAuthenticated()) {
      alert('Devi essere loggato per prenotare un evento.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.event) {
      alert('Evento non disponibile.');
      return;
    }

    if ((this.event as any).status === 'CANCELLED') {
      alert('Non puoi prenotare un evento cancellato.');
      return;
    }

    const booking = {
      userId: this.authService.getUserId()!,
      eventId: this.event.id!,
      bookingTime: new Date().toISOString()
    };

    this.bookingService.createBooking(booking).subscribe({
      next: () => alert('Prenotazione effettuata con successo!'),
      error: () => alert('Errore durante la prenotazione. Riprova più tardi.')
    });
  }
}
