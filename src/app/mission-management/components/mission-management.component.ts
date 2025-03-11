import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource } from '@angular/material/table';
import { ChartData } from 'chart.js';
import { MissionService } from '../../services/missions.service';
import { Mission } from '../../interfaces/Mission';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription, tap } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../interfaces/User';
import { UserService } from '../../services/users.service';
import { MissionDetailsComponentComponent } from '../../components/mission-details-component/mission-details-component.component';

// interface User {
//   id: number;
//   name: string;
//   role: string;
// }

@Component({
  selector: 'app-mission-management',
  imports: [
    CommonModule,
    BaseChartDirective,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,

    MatProgressSpinnerModule,
    TitleCasePipe,

  ],
  standalone: true,
  templateUrl: './mission-management.component.html',
  styleUrls: ['./mission-management.component.scss']
})
export class MissionManagementComponent implements OnInit, OnDestroy {
  objectif: any;
  missionsFronApi: Mission[] = [];
  isLoading = false;
  typeOptions = [
    "Informatiques",
    "Sante",
    "Education",
    "Religieux"
  ];
  isSaving!: boolean;

  statusColor(status: string) {
    switch (status) {
      case 'En Cour': return 'blue';
      case 'Termine': return 'green';
      case 'En attente': return 'gray';
      default: return 'gray';
    }
  }

  @ViewChild('missionDialog') missionDialog!: TemplateRef<any>;

  // Formulaire
  missionForm!: FormGroup;
  editMode = false;
  currentMissionId: number | null = null;

  // Filtres
  searchQuery = '';
  filterStatus = '';

  // Tableau
  displayedColumns: string[] = ['id', 'name', 'status', 'assignee', 'startDate', 'endDate', 'progress', 'actions'];
  missions = new MatTableDataSource<Mission>([]);
  selection = new SelectionModel<Mission>(true, []);

  // Données pour les graphiques
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  chartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Progression des missions',
        data: [65, 59, 80, 81],
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        borderWidth: 1
      }
    ]
  };

  // Données pour les graphiques spécifiques
  missionChartData = {
    labels: ['En cours', 'Terminées', 'En attente'],
    datasets: [
      {
        data: [25, 12, 5],
        backgroundColor: ['#3b82f6', '#10b981', '#6b7280']
      }
    ]
  };

  progressChartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Progression des missions',
        data: [10, 20, 30, 40, 50, 60],
        backgroundColor: '#3b82f6'
      }
    ]
  };

  typeChartData = {
    labels: ['Développement', 'Marketing', 'Support'],
    datasets: [
      {
        data: [15, 10, 7],
        backgroundColor: ['#facc15', '#f87171', '#34d399']
      }
    ]
  };


  users$!: Observable<User[]>
  users: User[] = []
  filteredUsers: User[] = [];

  statusOptions = [
    "En Cour",
    "Termine",
    "En attente"
  ];

  missions$!: Observable<Mission[]>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder,
    private readonly missionService: MissionService,
    private readonly route: ActivatedRoute,
    private readonly snackbar: MatSnackBar,
    private readonly userService: UserService
  ) { }
  private subscription?: Subscription;
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.initMissionForm();
    this.loadMissionByResolver();
    this.loadUsers()
  }
  loadUsers(): void {
    this.users$ = this.userService.getAllUsers()

    this.users$.subscribe({

      next: (users) => {
        this.users = users.filter(user => user.nom && user.nom.trim() !== '')
      }
    })
  }

  loadMissionByResolver(): void {
    this.isLoading = true;
    this.missions$ = this.route.data.pipe(
      map(data => data['missions']),
      tap(() => this.isLoading = false)

    );

    this.missions$.subscribe({
      next: (missions) => {
        this.missions.data = missions
        this.isLoading = false
      },
      error: (err) => {
        console.log("Erreur lors du chargement", err)
        this.isLoading = false
      }
    }
    );
  }
  initMissionForm(): void {
    this.missionForm = this.fb.group({
      id: [null], // Optionnel, si présent
      name: ['', Validators.required],
      type: [''],
      description: [''],
      status_paiement: [''],
      status_mission: ['', Validators.required],
      objectif: [''],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      budget: [0, [Validators.required, Validators.min(0)]],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      utilisateur: [null, Validators.required]
    });
  }


  // Formatage des libellés
  formatProgressLabel(value: number): string {
    return `${value}%`;
  }

  // Gestion des missions
  openMissionDialog(mission?: Mission): void {
    if (mission) {
      this.editMode = true;
      this.currentMissionId = mission.id;
      this.missionForm.patchValue(mission);
    } else {
      this.editMode = false;
      this.missionForm.reset();
    }
    this.dialog.open(this.missionDialog, {
      width: '800px',
      maxWidth: "800px",
      disableClose: true
    });
  }

  editMission(mission: Mission): void {
    this.editMode = true;
    this.currentMissionId = mission.id;
    this.missionForm.patchValue(mission);
    this.dialog.open(this.missionDialog, {
      width: '800px',
      maxWidth: "800px",
      disableClose: true
    });
  }
  saveMission(): void {
    this.isSaving = true
    if (this.missionForm.invalid) return;

    const missionData: Mission = this.missionForm.value;
    const operation$ = this.editMode && this.currentMissionId !== null
      ? this.missionService.updateMission({ ...missionData, id: this.currentMissionId })
      : this.missionService.addMission(missionData);

    operation$.subscribe({
      next: (savedMission) => {
        this.refreshMissionsData(savedMission);
        this.snackbar.open(`Mission ${this.editMode ? 'mise à jour' : 'ajoutée'} !`, 'Fermer', {
          duration: 3000
        });
        this.dialog.closeAll();
      },
      error: (error) => {
        console.error(`Erreur ${this.editMode ? 'mise à jour' : 'ajout'}`, error);

      }
    });

    operation$.subscribe({
      next: () => this.isSaving = false,
      error: () => this.isSaving = false
    });


  }
  refreshMissionsData(updatedMission: Mission) {
    this.missionService.getMissions().subscribe(missions => {
      const dataSource = this.missions.data;

      if (this.editMode) {
        const index = dataSource.findIndex(m => m.id === updatedMission.id);
        if (index > -1) dataSource[index] = updatedMission;
      } else {
        dataSource.push(updatedMission);
      }

      this.missions.data = [...dataSource];
    });
  }

  viewMissionDetails(mission: Mission): void {
    // Implémentation pour voir les détails de la mission
    console.log('Voir détails de la mission:', mission);
    const dialRef = this.dialog.open(MissionDetailsComponentComponent, {
      width: "1000px",
      data: { mission }
    })
    dialRef.afterClosed().subscribe(result => {
      console.log('Détails de la mission fermés');

    })
  }

  downloadReport(mission: Mission): void {
    // Implémentation pour télécharger le rapport
    console.log('Téléchargement du rapport pour la mission:', mission);
    // Logique pour générer et télécharger un rapport
  }

  deleteMission(mission: Mission): void {
    // Confirmation de suppression (pourrait être implémenté avec un dialogue de confirmation)
    if (confirm(`Êtes-vous sûr de vouloir supprimer la mission "${mission.name}" ?`)) {
      this.missionService.deleteMission(mission.id).subscribe({
        next: () => {
          this.snackbar.open("Mission supprimée avec succès !", 'Fermer', {
            duration: 5000
          });
          // Filtre simplement le tableau existant
          this.missions.data = this.missions.data.filter(m => m.id !== mission.id)
        },
        error: (error) => {
          this.snackbar.open(`Une erreur s'est produite'!`, 'Fermer', {
            duration: 3000
          });
          console.log(error);

        }
      })

    }
  }

  getUserById(userId: number): User | undefined {
    return this.users.find(user => user.id === userId);
  }
}