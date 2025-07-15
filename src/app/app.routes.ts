import { Routes } from '@angular/router';
import {OrganizerGuard} from './guards/organizer.guard';
import {AuthGuard} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./feature/home/home.component').then(m => m.HomeComponent)
  },


  {
    path: 'events',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./feature/events/event-list/event-list.component').then(m => m.EventListComponent)
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./feature/events/event-form/event-form.component').then(m => m.EventFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./feature/events/event-form/event-form.component').then(m => m.EventFormComponent)
      }
    ]
  },
  {
    path: 'preferiti',
    loadComponent: () =>
      import('./feature/favorites/favorites.component').then(m => m.FavoritesComponent)
    // canActivate: [AuthGuard]
  },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./feature/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'registration',
        loadComponent: () =>
          import('./feature/auth/registration/registration.component').then(m => m.RegistrationComponent)
      }
    ]
  },

  {
    path: 'bookings',
    loadComponent: () =>
      import('./feature/booking/booking.component').then(m => m.BookingComponent),
    canActivate: [AuthGuard,OrganizerGuard]   // <-- proteggi questa rotta
  },

  {
    path: 'user-list',
    loadComponent: () =>
      import('./feature/user-list/user-list.component').then(m => m.UserListComponent),
    canActivate: [OrganizerGuard]
  },
  {
    path: 'organizer-dashboard',
    loadComponent: () =>
      import('./organizer-dashboard/organizer-dashboard.component').then(m => m.OrganizerDashboardComponent),
    canActivate: [OrganizerGuard]
  },





];
