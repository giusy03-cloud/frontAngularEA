import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.getRole() !== 'ORGANIZER') {
      alert('Accesso non autorizzato');
      return;
    }

    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.users = users;
        this.isLoading = false;
      },
      error: err => {
        console.error('Errore nel caricamento utenti:', err);
        this.isLoading = false;
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questo utente?')) {
      this.userService.deleteUser(id).subscribe({
        next: msg => {
          alert(msg);
          this.users = this.users.filter(u => u.id !== id);
        },
        error: err => {
          console.error('Errore nella cancellazione:', err);
          alert('Impossibile eliminare utente.');
        }
      });
    }
  }
}
