import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../interfaces/User';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MentorService} from '../../../services/mentor.service';
import {MatSnackBar} from '@angular/material/snack-bar';

interface Qualification {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create-mentor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './create-mentor.component.html',
  styleUrl: './create-mentor.component.scss'
})
export class CreateMentorComponent implements OnInit {

  mentorForm!: FormGroup;
  roles = ['MENTOR', 'CONSULTANT', 'VALIDATOR'];

  // Tableau des qualifications disponibles
  qualifications: Qualification[] = [
    { id: 1, name: 'Diplôme d\'ingénieur' },
    { id: 2, name: 'Master en informatique' },
    { id: 3, name: 'Certification Angular' },
    { id: 4, name: 'Certification React' },
    { id: 5, name: 'Certification AWS' },
    { id: 6, name: 'Certification Azure' },
    { id: 7, name: 'Certification GCP' },
    { id: 8, name: 'Certification Scrum Master' },
    { id: 9, name: 'Certification Product Owner' },
  ];

  constructor(
    private mentorService: MentorService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateMentorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.handleRoleChange();
  }

  createForm(): void {
    this.mentorForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telephone: ['', Validators.required],
      adress: ['', Validators.required],
      dateNaissance: [''],
      iban: ['', Validators.required],
      roles: ['MENTOR'],
      mentorProfile: this.fb.group({
        hourlyRate: [2500.0, [Validators.required, Validators.min(0)]],
        qualification: this.fb.array(
          this.qualifications.map(() => this.fb.control(false))
        )
      })
    });
  }

  handleRoleChange(): void {
    this.mentorForm.get('roles')?.valueChanges.subscribe(role => {
      if (role === 'MENTOR') {
        if (!this.mentorForm.get('mentorProfile')) {
          this.mentorForm.addControl('mentorProfile', this.fb.group({
            hourlyRate: [2500.0, [Validators.required, Validators.min(0)]],
            qualification: this.fb.array(
              this.qualifications.map(() => this.fb.control(false))
            )
          }));
        }
      } else {
        if (this.mentorForm.get('mentorProfile')) {
          this.mentorForm.removeControl('mentorProfile');
        }
      }
    });
  }
  private showSnackBar(message: string, type: 'success' | 'error' | 'info'): void {
    const panelClass = {
      'success': ['snackbar-success'],
      'error': ['snackbar-error'],
      'info': ['snackbar-info']
    }[type];

    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass
    });
  }
  // Méthode pour obtenir les qualifications sélectionnées
  getSelectedQualifications(): number[] {
    const selectedQualifications = this.mentorForm.get('mentorProfile.qualification')?.value;
    return this.qualifications
      .filter((_, index) => selectedQualifications[index])
      .map(qual => qual.id);
  }

  onSubmit(): void {
    if (this.mentorForm.valid) {
      const formData = {
        ...this.mentorForm.value,
        roles: [this.mentorForm.value.roles]
      };

      // Si c'est un mentor, transformer le tableau de booléens en tableau d'IDs de qualifications
      if (formData.roles.includes('MENTOR') && formData.mentorProfile) {
        formData.mentorProfile.qualification = this.getSelectedQualifications();
      }

     this.mentorService.addMentor(formData).subscribe({
       next: (response) => {
           console.log(response);

         this.showSnackBar(` Le mentor${response.nom} a ete ajoute avec success`,"success")
         setTimeout(() => {
           this.dialogRef.close({
             action: "add",
             data: response
           });
         },1000)
       },
       error: (error) => {
         console.log(error);
         this.showSnackBar("Une Erreur s'est produites lors de la'ajout d'un menotr","error")
         this.dialogRef.close({action: "error"});

       }
     })

    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
