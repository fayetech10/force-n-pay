import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../interfaces/User';
import { UserDataService } from '../../services/components/UsersDataService.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponentComponent } from '../../components/loading-component/loading-component.component';
import { CreateMentorComponent } from '../../components/mentor/create-mentor/create-mentor.component';

@Component({
  selector: 'app-mentor',
  imports: [
    MatCardModule,
    MatListModule,

    MatChipsModule,
    MatDividerModule,
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './mentor.component.html',
  styleUrl: './mentor.component.scss'
})
export class MentorComponent implements OnInit {
  onPageChange($event: PageEvent) {
    throw new Error('Method not implemented.');
  }
  dataSource!: MatTableDataSource<User>;
  displayedColumns: string[] = ['status', 'name', 'role', 'qualifications', 'rate', 'actions'];
  totalUsers: unknown;
  pageSize: unknown;
  mentorForm!: FormGroup
  toggleUserStatus(_t122: any) {
    throw new Error('Method not implemented.');
  }
  deleteUser(_t122: any) {
    throw new Error('Method not implemented.');
  }
  editUser(_t122: any) {
    throw new Error('Method not implemented.');
  }
  viewDetails(_t122: any) {
    throw new Error('Method not implemented.');
  }


  mentor$!: Observable<User[]>
  isLoading: boolean = false
  mentors: User[] = []
  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private userDataService: UserDataService) { }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<User>([])
    this.loadMentors()

    this.createForm()


  }
  createForm() {
    this.mentorForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      adress: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      iban: ['', Validators.required],
      roles: ['MENTOR', Validators.required], // Valeur fixe
      mentorProfile: this.fb.group({
        hourlyRate: [2500.0, [Validators.required, Validators.min(0)]]
      })

    })
  }
  addMentor(): void {
    const matDialogRef = this.matDialog.open(CreateMentorComponent, {
      width: "1000px",
      data: {}
    })


  }

  loadMentors(): void {
    this.isLoading = true
    const matDialogRef = this.matDialog.open(LoadingComponentComponent, {
      width: "100%",
      data: {
        title: "Chargement des Mentors",
        message: "Le chargement est en cours",
      }
    })

    this.userDataService.loadUsers().pipe(
      map(mentors => mentors.filter(m => m.roles.includes("MENTOR")))
    ).subscribe({
      next: (mentors) => {
        this.dataSource.data = mentors
        this.mentors = mentors
        this.isLoading = false
        matDialogRef.close()
      },
      error: (err) => {
        console.log(err)
        this.isLoading = false
        matDialogRef.close()
      }
    })

  }


}
