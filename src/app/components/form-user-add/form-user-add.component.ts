import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/users.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Validateurs personnalisés
const phoneValidator = (control: AbstractControl) => {
  if (!control.value) return null;
  const pattern = /^\+?[1-9]\d{1,14}$/;
  return pattern.test(control.value) ? null : { invalidPhone: true };
};

const ibanValidator = (control: AbstractControl) => {
  if (!control.value) return null;
  const pattern = /^[A-Z]{2}\d{2}[A-Z0-9]{4,32}$/;
  return pattern.test(control.value.replace(/\s/g, '')) ? null : { invalidIban: true };
};

const commaSeparatedValidator = (control: AbstractControl) => {
  if (!control.value) return null;
  const items = control.value.split(',').map((item: string) => item.trim());
  return items.length > 0 && items.every((item: string) => item.length > 0)
    ? null
    : { invalidList: true };
};

@Component({
  selector: 'app-user-registration',
  templateUrl: './form-user-add.component.html',
  styleUrls: ['./form-user-add.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class FormUserAddComponent {
  onClose() {
    this.dialogRef.close()
  }
  currentStep = signal(0);
  showPassword = signal(false);
  passwordStrength = signal(0);
  isLoading = signal(false);
  formSubmitted = signal(false);

  // Formulaires réactifs
  personalInfoForm: FormGroup;
  professionalInfoForm: FormGroup;
  loginInfoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormUserAddComponent>,
    private userService: UserService,
    private fb: FormBuilder) {
    this.personalInfoForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.maxLength(50)]],
      nom: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, phoneValidator]],
      address: ['', [Validators.required, Validators.maxLength(200)]]
    });

    this.professionalInfoForm = this.fb.group({
      iban: ['', [Validators.required]],
      hourlyRate: [0, [Validators.required, Validators.min(0)]],
      qualifications: ["", [Validators.required, commaSeparatedValidator]],
      roles: ['', [Validators.required, commaSeparatedValidator]]
    });

    this.loginInfoForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      isActive: [true],
      biometricAuth: [false]
    });

    // Surveillance des changements du mot de passe
    this.loginInfoForm.get('password')?.valueChanges.subscribe(value => {
      if (value) this.updatePasswordStrength(value);
    });
  }

  // Navigation dans les étapes
  nextStep() {
    // Marque tous les champs comme "touchés" pour forcer l'affichage des erreurs
    switch (this.currentStep()) {
      case 0:
        this.personalInfoForm.markAllAsTouched();
        break;
      case 1:
        this.professionalInfoForm.markAllAsTouched();
        break;
      case 2:
        this.loginInfoForm.markAllAsTouched();
        break;
    }

    if (this.isCurrentFormValid()) {
      this.currentStep.update(v => Math.min(v + 1, 2));
    }
  }

  previousStep() {
    this.currentStep.update(v => Math.max(v - 1, 0));
  }

  private isCurrentFormValid(): boolean {
    switch (this.currentStep()) {
      case 0: return this.personalInfoForm.valid;
      case 1: return this.professionalInfoForm.valid;
      case 2: return this.loginInfoForm.valid;
      default: return false;
    }
  }

  // Calcul de la force du mot de passe
  updatePasswordStrength(password: string) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    this.passwordStrength.set(Math.min(strength, 4));
  }

  getPasswordFeedback(): string {
    const strength = this.passwordStrength();
    switch (strength) {
      case 0: return 'Très faible';
      case 1: return 'Faible';
      case 2: return 'Moyen';
      case 3: return 'Fort';
      case 4: return 'Très fort';
      default: return '';
    }
  }

  getPasswordStrengthColor(): string {
    const strength = this.passwordStrength();
    switch (strength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  }

  // Soumission finale
  async onSubmit() {
    this.formSubmitted.set(true);

    if (this.allFormsValid()) {
      this.isLoading.set(true);

      const formData = {
        ...this.personalInfoForm.value,
        ...this.professionalInfoForm.value,
        ...this.loginInfoForm.value,
        qualifications: this.professionalInfoForm.value.qualifications.split(',').map((q: string) => q.trim()),
        roles: this.professionalInfoForm.value.roles.split(',').map((r: string) => r.trim())
      };

      try {
        this.userService.addUser(formData).subscribe({
          next: (createdUser) => {
            console.log('Utilisateur créé:', createdUser);
            this.resetForms();
            this.currentStep.set(0);
            this.formSubmitted.set(false);

            this.dialogRef.close(createdUser);
          },
          error: (err) => {
            console.error('Erreur:', err);
            this.isLoading.set(false);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }


  private allFormsValid(): boolean {
    return [
      this.personalInfoForm.valid,
      this.professionalInfoForm.valid,
      this.loginInfoForm.valid
    ].every(Boolean);
  }

  private resetForms() {
    this.personalInfoForm.reset();
    this.professionalInfoForm.reset();
    this.loginInfoForm.reset({
      isActive: true,
      biometricAuth: false
    });
    this.passwordStrength.set(0);
  }

  get progressPercentage(): number {
    return ((this.currentStep() + 1) / 3) * 100;
  }

  get passwordInputType(): string {
    return this.showPassword() ? 'text' : 'password';
  }

  hasError(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return control ? control.invalid && (control.touched || this.formSubmitted()) : false;
  }

  getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return `Ce champ est requis`;
    if (control.errors['email']) return `Format email invalide`;
    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Minimum ${minLength} caractères`;
    }
    if (control.errors['invalidPhone']) return `Format téléphone invalide`;
    if (control.errors['invalidIban']) return `Format IBAN invalide`;
    if (control.errors['invalidList']) return `Format invalide (ex: Valeur1, Valeur2)`;

    return `Champ invalide`;
  }
}