import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/User';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  user!: User
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Redirige les utilisateurs déjà connectés
    
  }

  login(): void {
    this.errorMessage = '';
    this.isLoading = true;


    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.authService.getUserProfile().subscribe({
          next: (user) => {
            this.user = user
            if (this.user.roles.includes("ADMIN")) {
              this.router.navigate(["/dashboard"])
            } else if (this.user.roles.includes("CONSULTANT")) {
              this.router.navigate(["/dashboard/consultant"])
            }else if(this.user.roles.includes("MENTOR")){
              this.router.navigate(["/dashboard/mentor"])
            }
          },
          error: (error) => {
            console.log(error)
            this.isLoading = false
          }
        })

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = err.message || 'Échec de la connexion';
        this.isLoading = false;
      }
    });
  }
}