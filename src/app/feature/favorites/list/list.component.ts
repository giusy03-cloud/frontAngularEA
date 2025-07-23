import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../../services/favorite.service';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { Event } from '../../../models/event.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  favoriteEvents: Event[] = [];
  isLoading = false;

  constructor(
    private favoriteService: FavoriteService,
    private eventService: EventService,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();
    if (!userId || !token) {
      console.error('Utente non autenticato');
      return;
    }

    this.isLoading = true;

    this.favoriteService.getFavorites(userId, `Bearer ${token}`).subscribe({
      next: (favoriteIds: number[]) => {
        if (favoriteIds.length === 0) {
          this.favoriteEvents = [];
          this.isLoading = false;
          return;
        }

        this.eventService.getEventsByIds(favoriteIds, `Bearer ${token}`).subscribe({
          next: (events: Event[]) => {
            this.favoriteEvents = events;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Errore caricamento eventi preferiti:', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Errore caricamento preferiti:', err);
        this.isLoading = false;
      }
    });
  }



  removeFavorite(eventId: number): void {
    const userId = this.authService.getUserId();
    const token = this.authService.getToken();

    if (!userId || !token) {
      console.error('Utente non autenticato');
      return;
    }

    this.favoriteService.removeFromFavorites(userId, eventId, token).subscribe({
      next: () => {
        this.favoriteEvents = this.favoriteEvents.filter(e => e.id !== eventId);
        console.log(`Evento ${eventId} rimosso dai preferiti`);
      },
      error: (err) => {
        console.error('Errore rimozione preferito:', err);
      }
    });
  }








}
