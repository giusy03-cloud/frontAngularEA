import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../../../models/event.model';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  eventId?: number;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['id'];
    this.isEdit = !!this.eventId;

    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(1000)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      organizerId: [this.authService.getUserId(), Validators.required],
      price: [0, [Validators.min(0)]],
      capacity: [1, [Validators.min(1)]],
      status: ['', Validators.required],
    }, { validators: this.dateRangeValidator });  // <-- Validazione personalizzata

    if (this.isEdit) {
      this.eventService.getEventsPaged(0, 100).subscribe(data => {
        const event = data.content.find(e => e.id === +this.eventId!);
        if (event) {
          this.eventForm.patchValue({
            ...event,
            startDate: event.startDate.slice(0, 16),
            endDate: event.endDate.slice(0, 16)
          });
        }
      });
    }
  }

  // ✅ Validatore personalizzato
  dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const start = new Date(group.get('startDate')?.value);
    const end = new Date(group.get('endDate')?.value);
    if (start && end && start > end) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  onSubmit() {

    if (this.eventForm.invalid) {
      if (this.eventForm.errors?.['dateRangeInvalid']) {
        alert('La data di inizio non può essere successiva alla data di fine.');
      } else {
        alert('Compila correttamente tutti i campi obbligatori.');
      }
      return;
    }


    const event: Event = {
      ...this.eventForm.value,
      startDate: new Date(this.eventForm.value.startDate).toISOString(),
      endDate: new Date(this.eventForm.value.endDate).toISOString(),
    };

    if (this.isEdit) {
      event.id = this.eventId;
      this.eventService.updateEvent(event).subscribe(() => {
        alert('Evento aggiornato con successo');
        this.router.navigate(['/events']);
      });
    } else {
      this.eventService.createEvent(event).subscribe(() => {
        alert('Evento creato con successo');
        this.router.navigate(['/events']);
      });
    }
  }
}
