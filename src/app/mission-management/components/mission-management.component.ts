import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { map, Observable, tap } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';



interface User {
  id: number;
  name: string;
  role: string;
}

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
    MatProgressSpinnerModule

  ],
  templateUrl: './mission-management.component.html',
  styleUrls: ['./mission-management.component.scss']  // Corrigé : styleUrl -> styleUrls
})
export class MissionManagementComponent implements OnInit {
  objectif: any;
  missionsFronApi: Mission[] = [];
  isLoading = false
  statusColor(_t289: string) {
    throw new Error('Method not implemented.');
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
  displayedColumns: string[] = ['select', 'id', 'name', 'status', 'assignee', 'startDate', 'endDate', 'progress', 'actions'];
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
  }


  // Données utilisateurs
  users: User[] = [
    { id: 1, name: 'Jean Dupont', role: "admin" },
    { id: 2, name: 'Marie Martin', role: "Consultant" },
    { id: 3, name: 'Pierre Durand', role: "Consultant" },
    { id: 4, name: 'Sophie Lefebvre', role: "Consultant" },
    { id: 5, name: 'Thomas Bernard', role: "Consultant" }
  ];
  statusOptions = [
    "En Cour",
    "Termine",
    "En attente"
  ];

  missions$!: Observable<Mission[]>

  constructor(
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder,
    private readonly missionService: MissionService,
    private readonly route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.initMissionForm();
    // this.loadMissions();
    // this.loadMissionFromApi()
    this.loadMissionByResolver()
  }
  loadMissionByResolver(): void {
    this.isLoading = true
    this.missions$ = this.route.data.pipe(
      map(data => data['missions']),

      tap(() => this.isLoading = false)
    )

    this.missions$.subscribe(missions => {
      this.missions.data = missions
    },
      error => {
        console.error("Erreur lors du chargement des missions", error);
        this.isLoading = false;
      }
    )


  }
  // loadMissionFromApi(): void {
  //   this.isLoading = true
  //   this.missionService.getMission().subscribe({
  //     next: (missions: Mission[]) => {
  //       this.missionsFronApi = missions
  //       this.loadMissions()
  //       this.isLoading = false
  //       console.log(this.missionsFronApi)
  //     },
  //     error: (err) => {
  //       console.log("Error lors du chargement des mission", err.message)
  //       this.isLoading = false
  //     }
  //   })
  // }



  initMissionForm(): void {
    this.missionForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: ['En cours', Validators.required],
      assignee: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [null],
      progress: [0]
    });
  }

  loadMissions(): void {
    // Simuler le chargement des données depuis une API
    this.missions.data = [...this.missionsFronApi]
    this.missions._updateChangeSubscription()
  }

  // Gestion de la sélection dans le tableau
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.missions.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.missions.data.forEach(row => this.selection.select(row));
    }
  }

  // Formatage des libellés
  formatProgressLabel(value: number): string {
    return `${value}%`;
  }

  // Gestion des missions
  openMissionDialog(): void {
    this.editMode = false;
    this.currentMissionId = null;
    this.initMissionForm();
    this.dialog.open(this.missionDialog, {
      width: '800px',
      maxWidth: "800px",
      disableClose: true
    });
  }

  editMission(mission: Mission): void {
    this.editMode = true;
    this.currentMissionId = mission.id;

    this.missionForm.patchValue({
      name: mission.name,
      description: mission.description,
      status: mission.status,
      assignee: mission.assignee,
      startDate: mission.startDate ? new Date(mission.startDate) : null,
      endDate: mission.endDate ? new Date(mission.endDate) : null,
    });

    this.dialog.open(this.missionDialog, {
      width: '100%',
      disableClose: true
    });
  }

  saveMission(): void {
    if (this.missionForm.invalid) {
      return;
    }

    const formData = this.missionForm.value;

    // Formatage des dates pour la démonstration
    const formatDate = (date: Date) => {
      if (!date) return null;
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const missionData: Mission = {
      id: this.editMode && this.currentMissionId ? this.currentMissionId : Math.floor(Math.random() * 1000) + 6,
      name: formData.name,
      description: formData.description,
      status: formData.status,
      assignee: formData.assignee,
      startDate: formatDate(formData.startDate),
      endDate: formatDate(formData.endDate),
      // progress: formData.progress
    };

    // Mise à jour ou ajout de la mission
    if (this.editMode && this.currentMissionId) {
      const index = this.missions.data.findIndex(m => m.id === this.currentMissionId);
      if (index !== -1) {
        const updatedData = [...this.missions.data];
        updatedData[index] = missionData;
        this.missions.data = updatedData;
      }
    } else {
      this.missions.data = [...this.missions.data, missionData];
    }

    this.dialog.closeAll();
  }

  viewMissionDetails(mission: Mission): void {
    // Implémentation pour voir les détails de la mission
    console.log('Voir détails de la mission:', mission);
    // Ici, vous pourriez ouvrir un dialogue avec les détails ou naviguer vers une page dédiée
  }

  downloadReport(mission: Mission): void {
    // Implémentation pour télécharger le rapport
    console.log('Téléchargement du rapport pour la mission:', mission);
    // Logique pour générer et télécharger un rapport
  }

  deleteMission(mission: Mission): void {
    // Confirmation de suppression (pourrait être implémenté avec un dialogue de confirmation)
    if (confirm(`Êtes-vous sûr de vouloir supprimer la mission "${mission.name}" ?`)) {
      this.missions.data = this.missions.data.filter(m => m.id !== mission.id);
    }
  }
}
