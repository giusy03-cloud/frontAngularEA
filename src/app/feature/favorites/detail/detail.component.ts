import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FavoriteService } from '../../../services/favorite.service';
import { FavoriteList } from '../../../models/favorite-list.model';
import { Event } from '../../../models/event.model';
import { AuthService } from '../../../services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DetailComponent implements OnInit {
  list!: FavoriteList;
  events: Event[] = [];
  isUnauthorized = false;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private favoriteService: FavoriteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const publicToken = this.route.snapshot.paramMap.get('token');
    const idParam = this.route.snapshot.paramMap.get('id');

    if (publicToken) {
      // Accesso pubblico tramite token
      this.favoriteService.getPublicList(publicToken).subscribe({
        next: (data) => {
          this.list = data.favoriteList;
          this.events = data.events;
          this.isLoading = false;
        },
        error: () => {
          this.isUnauthorized = true;
          this.isLoading = false;
        }
      });
    } else if (idParam) {
      const id = +idParam;
      const userId = this.authService.getUserId();
      const token = this.authService.getToken();

      if (!userId || !token) {
        this.isUnauthorized = true;
        this.isLoading = false;
        return;
      }

      this.favoriteService.getListDetails(id, userId, `Bearer ${token}`).subscribe({
        next: (data) => {
          if (data.favoriteList.private && data.favoriteList.ownerId !== userId) {
            this.isUnauthorized = true;
          } else {
            this.list = data.favoriteList;
            this.events = data.events;
          }
          this.isLoading = false;
        },
        error: () => {
          this.isUnauthorized = true;
          this.isLoading = false;
        }
      });
    } else {
      this.isUnauthorized = true;
      this.isLoading = false;
    }
  }
}
