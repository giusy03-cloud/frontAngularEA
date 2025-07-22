import {ReviewListComponent} from './review-list/review-list.component';
import {ReviewFormComponent} from './review-form/review-form.component';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [ReviewListComponent, ReviewFormComponent],
  template: `
    <app-review-list [eventId]="eventId" #list></app-review-list>
    <app-review-form [eventId]="eventId" (submitted)="list.loadReviews()"></app-review-form>
  `
})
export class ReviewsComponent implements OnInit {
  @Input() eventId!: number;
  @Input() canReview: boolean = false;


  ngOnInit() {

  }
}
