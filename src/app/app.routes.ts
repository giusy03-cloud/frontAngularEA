import { Routes } from '@angular/router';

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
  }
  ,

  {
    path: 'profile',
    loadComponent: () =>
      import('./feature/profile/profile.component').then(m => m.ProfileComponent)
    // canActivate: [AuthGuard] (per ora rimosso)
  },
  {
    path: 'preferiti',
    loadComponent: () =>
      import('./feature/favorites/favorites.component').then(m => m.FavoritesComponent)
    // canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./feature/admin/admin.component').then(m => m.AdminComponent)
    // canActivate: [AdminGuard]
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
      import('./feature/booking/booking.component').then(m => m.BookingComponent)
    // canActivate: [AuthGuard]
  }
];
