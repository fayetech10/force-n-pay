import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../interfaces/User';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-mentor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './create-mentor.component.html',
  styleUrl: './create-mentor.component.scss'
})
export class CreateMentorComponent implements OnInit {

  mentorForm!: FormGroup
  roles = ['MENTOR', 'CONSULTANT', 'VALIDATOR'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateMentorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) { }
  ngOnInit(): void {
    this.createForm()
    this.handRoleChange()
  }
  createForm() {
    this.mentorForm = this.fb.group({
      nom: ["", Validators.required],
      prenom: ["", Validators.required],
      username: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      email: ["", [Validators.required, Validators.email]],
      telephone: ["", Validators.required],
      adress: ["", Validators.required],
      dateNaissance: ["", Validators],
      iban: ["", Validators.required],
      roles: ["MENTOR", Validators.required],
      mentorProfile: this.fb.group({
        hourlyRate: [2500.0, [Validators.required, Validators.min(0)]],
        qualifications: this.fb.array([
          this.fb.control('', Validators.required)
        ], Validators.required)
      })
    })
  }
  get qualifications() {
    return this.mentorForm.get('mentorProfile.qualifications') as FormArray;
  }
  removeQualification(index: number) {
    this.qualifications.removeAt(index);
  }
  addQualification() {
    this.qualifications.push(this.fb.control('', Validators.required));
  }
  handRoleChange() {
    this.mentorForm.get('roles')?.valueChanges.subscribe(role => {
      if (role === 'MENTOR') {
        this.mentorForm.addControl('mentorProfile', this.fb.group({
          hourlyRate: [2500.0, [Validators.required, Validators.min(0)]]
        }))
      } else {
        this.mentorForm.removeControl('mentorProfile')
      }
    })
  }

  onSubmit(): void {
    if (this.mentorForm.valid) {
      const formData = {
        ...this.mentorForm.value,
        roles: [this.mentorForm.value.roles]
      }
      console.log(formData);
    }
  }

}
