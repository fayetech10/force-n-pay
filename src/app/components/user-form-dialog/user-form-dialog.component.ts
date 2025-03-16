import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, finalize, takeUntil } from 'rxjs';

import { User } from '../../interfaces/User';
import { JsonPatchOperation } from '../../interfaces/JsonPatchOperation';
import { UserService } from '../../services/users.service';


interface UserFormDialogData {
  user: User;
  readOnly?: boolean;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss']
})
export class UserFormDialogComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  loading = false;
  isReadOnly = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: UserFormDialogData,
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar
  ) {
    this.isReadOnly = !!data.readOnly;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  saveChanges(): void {
    if (this.userForm.invalid || this.loading) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    const operations = this.generatePatchOperations();

    if (operations.length === 0) {
      this.dialogRef.close();
      return;
    }

    this.loading = true;
    this.userService.updateUser(this.data.user.id, operations)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (updatedUser) => {
          this.showNotification('Modifications enregistrées avec succès', 'success-snackbar');
          this.dialogRef.close(updatedUser);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          this.showNotification('Échec de la mise à jour', 'error-snackbar');
          this.dialogRef.close();

        }
      });
  }

  onCancel(): void {
    if (this.userForm.pristine || confirm('Voulez-vous vraiment annuler les modifications non enregistrées ?')) {
      this.dialogRef.close();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    const user = this.data.user;

    this.userForm = this.fb.group({
      nom: [user.nom, [Validators.required, Validators.maxLength(50)]],
      prenom: [user.prenom, [Validators.required, Validators.maxLength(50)]],
      dateNaissance: [user.dateNaissance, Validators.required],
      adress: [user.adress, [Validators.required, Validators.maxLength(200)]],
      telephone: [user.telephone, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
      qualifications: [user.qualifications?.join(', ') || ''],
      roles: [user.roles?.join(', ') || ''],
      hourlyRate: [user.hourlyRate, [Validators.required, Validators.min(0)]],
      iban: [user.iban, [Validators.required]],
      actif: [user.actif]
    });

    if (this.isReadOnly) {
      this.userForm.disable();
    }
  }

  
  private generatePatchOperations(): JsonPatchOperation[] {
    const formValue = this.userForm.value;
    const operations: JsonPatchOperation[] = [];

    Object.keys(formValue).forEach(key => {
      if (this.userForm.get(key)?.dirty) {
        let value = formValue[key];

        // Traitement spécial pour les qualifications
        if (key === 'qualifications' && typeof value === 'string') {
          value = value.split(',')
            .map((q: string) => q.trim())
            .filter((q: string) => q.length > 0);
        }

        operations.push({
          op: 'replace',
          path: `/${key}`,
          value
        });
      }
    });

    return operations;
  }

  private showNotification(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}