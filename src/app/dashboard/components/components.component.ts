import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../interfaces/User';
import { AuthService } from '../../services/auth.service';
import { MissionService } from '../../services/missions.service';
import { Mission } from '../../interfaces/Mission';
import { ActivitesService } from '../../services/activites.service';
import { Activity } from '../../interfaces/Actiites';
import { TimelineItem } from '../../interfaces/TimelineItem';
import { MatDialog } from '@angular/material/dialog';
import { MissionShowComponent } from '../../components/activity/mission-show/mission-show.component';
import { RapportShowComponent } from '../../components/activity/rapport-show/rapport-show.component';
import { SeanceShowComponent } from '../../components/activity/seance-show/seance-show.component';
import { PaiementShowComponent } from '../../components/activity/paiement-show/paiement-show.component';
@Component({
  selector: 'app-components',
  standalone: true,
  imports: [
    BaseChartDirective,
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatListModule,
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    BaseChartDirective,
    MatTableModule
  ],
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss']  // Fix: changed styleUrl to styleUrls
})
export class ComponentsComponent implements OnInit {
  onClick(timelineItems: any) {
    if (timelineItems.data.mission) {
      this.dialog.open(MissionShowComponent, {
        width: "1000px",
        data: { mission: timelineItems.data.mission }
      })
    } else if (timelineItems.data.rapport) {
      this.dialog.open(RapportShowComponent, {
        width: "1000px",
        data: { rapport: timelineItems.data.rapport }
      })
    } else if (timelineItems.data.seance) {
      this.dialog.open(SeanceShowComponent, {
        width: "1000px",
        data: { seance: timelineItems.data.seance }
      })
    } else if (timelineItems.data.paiement) {
      this.dialog.open(PaiementShowComponent, {
        width: "1000px",
        data: { paiement: timelineItems.data.paiement }
      })
    }



  }


  // Données pour le graphique circulaire des missions
  missionChartData = [25, 12, 5]; // En cours, Terminées, En attente
  missionChartLabels = ['En cours', 'Terminées', 'En attente'];
  missionChartColors = ['#3B82F6', '#10B981', '#9CA3AF'];
  user!: User
  missions: Mission[] = []
  allMissions: Mission[] = [];
  dataSource: Mission[] = [];
  filterStatus: string = 'all';
  activitiess: Activity[] = []
  timelineItems: TimelineItem[] = []


  missionStatus: string = ''

  displayedColumns: string[] = ['name', 'status', 'user', 'date', 'actions'];

  isLoading: boolean = false
  isFilterLoading: boolean = false
  constructor(
    private dialog: MatDialog,
    private missionService: MissionService,
    private activityService: ActivitesService,
  ) {
    Chart.register(...registerables)
  }

  // Graphique des utilisateurs
  public userChartData: ChartData<'line'> = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Consultants',
        data: [12, 19, 15, 20, 22, 25],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Mentors',
        data: [5, 7, 6, 9, 10, 12],
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };



  // Options des graphiques
  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true, mode: 'index', intersect: false }
    }
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: 'rgba(156, 163, 175, 0.1)' } }
    },
    plugins: {
      legend: { position: 'top', align: 'end' },
      tooltip: { enabled: true, mode: 'index', intersect: false }
    }
  };
  ngAfterViewInit(): void {
    this.createMissionChart();
    this.createUserChart();




  }
  createMissionChart(): void {
    new Chart('missionChart', {
      type: 'doughnut',
      data: {
        labels: this.missionChartLabels,
        datasets: [{
          data: this.missionChartData,
          backgroundColor: this.missionChartColors,
          hoverBackgroundColor: ['#2563EB', '#059669', '#6B7280'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#4B5563',
            borderColor: '#E5E7EB',
            borderWidth: 1
          }
        }
      }
    });
  }
  createUserChart(): void {
    new Chart('userChart', {
      type: 'line',
      data: this.userChartData,
      options: {
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#4B5563',
            borderColor: '#E5E7EB',
            borderWidth: 1
          }
        }
      }
    });
  }
  isDarkMode = false;

  ngOnInit(): void {
    this.checkDarkMode();
    this.setupChartTheme();
    this.loadMissions()
    this.loadActivity()

  }
  loadActivity(): void {
    this.activityService.getAllActivity().subscribe({
      next: (activities) => {
        this.activitiess = activities
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        this.processActivitiesToTimeline();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des activités :', err.message);
      }
    });
  }

  processActivitiesToTimeline() {
    this.timelineItems = this.activitiess.map(activity => {
      const date = new Date(activity.date)
      let typeConfig

      if (activity.mission) {
        typeConfig = this.getMissionConfig(activity.mission);
      } else if (activity.seance) {
        typeConfig = this.getSessionConfig(activity.seance);
      } else if (activity.paiement) {
        typeConfig = this.getPaymentConfig(activity.paiement);
      } else if (activity.rapport) {
        typeConfig = this.getReportConfig(activity.rapport);
      }

      return {
        icon: typeConfig?.icon || 'help',
        color: typeConfig?.color || 'gray',
        title: activity.name,
        data: activity,
        time: this.getTimeAgo(date),
        ...typeConfig?.extra
      }

    })
  }
  private getMissionConfig(activity: any) {
    return {
      icon: 'add_circle',
      color: 'blue',
      data: activity,
      extra: {
        subtitle: activity.mission?.name || ''
      }
    };
  }

  private getSessionConfig(activity: any) {
    return {
      icon: 'people',
      color: 'purple',
      data: activity,
      extra: {
        badge: 'Nouveau'
      }
    };
  }

  private getPaymentConfig(activity: any) {
    return {
      icon: 'check_circle',
      color: 'green',
      data: activity,

      extra: {
        subtitle: activity.paiement?.mission?.name || ''
      }
    };
  }

  private getReportConfig(activity: any) {
    return {
      icon: activity.rapport?.statut === 'rejeté' ? 'cancel' : 'assignment',
      data: activity,
      color: activity.rapport?.statut === 'rejeté' ? 'red' : 'amber',
      extra: {
        warning: activity.rapport?.commentaire
      }
    };
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }


  loadMissions(): void {
    this.isLoading = true
    this.missionService.getMissions().subscribe({
      next: (missions) => {
        this.allMissions = missions.slice(0, 6)
        this.applyFilter('all')
        setTimeout(() => {
          this.isLoading = false
        }, 1000);

      },
      error: (err) => {
        console.log(err)
        this.isLoading = false
      }
    })
  }
  applyFilter(status: string): void {
    this.isFilterLoading = true;
    this.filterStatus = status;

    // Donne un cycle de rendu à Angular pour afficher le spinner
    setTimeout(() => {
      let missionsFiltrées = this.allMissions;

      if (status !== 'all') {
        missionsFiltrées = this.allMissions.filter(m => m.status_mission === status);
      }

      this.dataSource = missionsFiltrées;
      this.isFilterLoading = false;
    }, 100);
  }


  checkDarkMode(): void {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    this.isDarkMode = darkModeEnabled;
    if (darkModeEnabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    this.setupChartTheme();
  }

  setupChartTheme(): void {
    // Simplified chart color theme change for dark mode
    const color = this.isDarkMode ? '#9CA3AF' : '#4B5563';
    this.lineChartOptions.scales = {
      x: { ticks: { color } },
      y: { ticks: { color } }
    };
  }

  refreshData(): void {
    console.log('Rafraîchissement des données...');
  }

  filterByPeriod(period: string): void {
    console.log(`Filtrage par période: ${period}`);
  }

  exportData(format: string = 'csv'): void {
    console.log(`Exportation des données au format ${format}`);
  }
}
