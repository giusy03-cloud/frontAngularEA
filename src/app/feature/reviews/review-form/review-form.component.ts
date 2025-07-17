import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../services/review.service';



@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent {
  @Input() eventId!: number;
  @Output() submitted = new EventEmitter<void>();

  review = {
    userId: 0,
    eventId: 0,
    rating: 0,
    comment: ''
  };

  constructor(private reviewService: ReviewService) {}

  submit() {
    const payload = {
      ...this.review,
      eventId: this.eventId
    };

    this.reviewService.submitReview(payload).subscribe({
      next: () => {
        alert('Review inviata con successo!');
        this.review = { userId: 0, eventId: 0, rating: 0, comment: '' };
        this.submitted.emit();
      },
      error: (err) => {
        console.error('Errore nell’invio:', err);
        alert('Errore durante l’invio della recensione');
      }
    });
  }
}
