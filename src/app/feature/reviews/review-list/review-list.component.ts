import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService, Review } from '../../../services/review.service';



@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  @Input() eventId!: number;

  reviews: Review[] = [];
  averageRating = 0;

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    if (!this.eventId) return;

    this.reviewService.getReviewsByEvent(1).subscribe({
      next: (data) => {
        this.reviews = data;
        const sum = this.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
        this.averageRating = this.reviews.length ? +(sum / this.reviews.length).toFixed(1) : 0;
      },
      error: (err) => {
        console.error('Errore nel caricamento delle recensioni:', err);
        this.reviews = [];
        this.averageRating = 0;
      }
    });
  }
}
