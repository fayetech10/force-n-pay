import { CommandModule } from '@angular/cli/src/command-builder/command-module';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/User';
import { Router } from '@angular/router';
import { finalize, switchMap, take, tap, timer } from 'rxjs';

@Component({
  selector: 'app-password-update',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './password-update.component.html',
  styleUrl: './password-update.component.scss'
})
export class PasswordUpdateComponent implements OnInit, OnDestroy {

  user!: User
  changePasswordForm!: FormGroup
  errorMessage: string = ''
  successMessage: string = ''
  redirectCountdown = 0;

  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isSubmitting: boolean = false;

  passwordStrength: number = 0;
  private countdownInterval: any;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loadUser()

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmationPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator })
  }
  loadUser(): void {
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmationPassword')?.value ? null : { mismatch: true }
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.authService.updatePassword(
        this.changePasswordForm.value.oldPassword,
        this.changePasswordForm.value.newPassword,
        this.changePasswordForm.value.confirmationPassword
      ).pipe(
        switchMap(response => {
          this.successMessage = response.message
          this.isSubmitting = true
          return this.authService.updateUser(this.user.id, true)
        }),
        tap({
          next: (updatedUser) => {
            console.log("Utilisateur modifié avec succès", updatedUser);
            this.startRedirectCountdown();
          }, error: (err) => {
            this.errorMessage = err.message
            this.successMessage = ''
            this.isSubmitting = false
          }
        })
      ).subscribe({
        error: (err) => {
          this.errorMessage = err.message
          this.successMessage = ''
          this.isSubmitting = false
        }
      })
    }
  }

  private startRedirectCountdown() {
    this.changePasswordForm.reset();
    this.redirectCountdown = 5;

    const subscription = timer(1000, 1000).pipe(
      take(5),
      finalize(() => this.router.navigate(['/dashboard']))
    ).subscribe({
      next: (val) => this.redirectCountdown = 5 - val - 1
    });

    this.countdownInterval = subscription;
  }
  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
  }
}
