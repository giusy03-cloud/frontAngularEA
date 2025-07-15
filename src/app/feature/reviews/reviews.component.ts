import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  standalone: true,
  imports: [FormsModule,CommonModule],
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  @Input() eventId!: number;  // Ricevuto dal componente padre
  userId: number = Number(localStorage.getItem('userId')); // oppure recuperalo dal tuo AuthService

  reviews: Review[] = [];  // ✅ necessario per il *ngFor
  newReview: Review = {    // ✅ necessario per [(ngModel)]
    eventId: 0,
    userId: 0,
    rating: 0,
    comment: ''
  };

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviewsByEvent(this.eventId).subscribe(
      data => this.reviews = data
    );
  }

  submitReview(): void {
    this.newReview.eventId = this.eventId;
    this.newReview.userId = this.userId;

    this.reviewService.createReview(this.newReview).subscribe(() => {
      this.loadReviews();
      this.newReview = {
        eventId: this.eventId,
        userId: this.userId,
        rating: 0,
        comment: ''
      };
    });
  }
}
