import { Routes } from '@angular/router';
import {OrganizerGuard} from './guards/organizer.guard';
import {AuthGuard} from './guards/auth.guard';
import { HomeComponent } from './feature/home/home.component';
import {DetailComponent} from './feature/favorites/detail/detail.component';
import {CreateComponent} from './feature/favorites/create/create.component';
import {ListComponent} from './feature/favorites/list/list.component';



export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '', component: HomeComponent },

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
      },
      { path: ':id/review', loadComponent: () => import('./feature/reviews/review-list/review-list.component').then(m => m.ReviewListComponent) },
      {
        path: ':id',
        loadComponent: () =>
          import('./feature/events/event-details/event-details.component').then(m => m.EventDetailsComponent)
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
    canActivate: [AuthGuard,OrganizerGuard]
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

  {
    path: 'reviews',
    loadComponent: () =>
      import('./feature/reviews/reviews.component').then(m => m.ReviewsComponent),
    //canActivate: [AuthGuard] // opzionale, se vuoi solo utenti loggati
  },
  {
    path: 'my-bookings',
    loadComponent: () =>
      import('./feature/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent),
    canActivate: [AuthGuard]  // solo utenti autenticati
  },
  {
    path: 'favorites',
    children: [
      { path: '', component: ListComponent, canActivate: [AuthGuard] },
      { path: 'create', component: CreateComponent, canActivate: [AuthGuard] },
      { path: ':id', component: DetailComponent, canActivate: [AuthGuard] }
    ]
  },

  { path: 'favorites/public/:token', component: DetailComponent },





  /*
  {
    path: 'profile',
    loadComponent: () => import('./feature/profile/profile.component').then(m => m.ProfileComponent)
  },

   */




];
