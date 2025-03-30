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

  // Données pour le graphique circulaire des missions
  missionChartData = [25, 12, 5]; // En cours, Terminées, En attente
  missionChartLabels = ['En cours', 'Terminées', 'En attente'];
  missionChartColors = ['#3B82F6', '#10B981', '#9CA3AF'];
  user!: User

  displayedColumns: string[] = ['name', 'status', 'user', 'date', 'actions'];
  recentMissions = [
    { id: 'M-042', name: 'Développement UI', status: 'En cours', user: 'Jean Dupont', date: '15 mars 2025' },
    { id: 'M-041', name: 'Audit de sécurité', status: 'Terminée', user: 'Marie Laurent', date: '12 mars 2025' },
    { id: 'M-040', name: 'Migration de base de données', status: 'En attente', user: 'Thomas Bernard', date: '10 mars 2025' },
    { id: 'M-039', name: 'Test d\'intégration', status: 'En cours', user: 'Sophie Martin', date: '8 mars 2025' }
  ];
  dataSource = this.recentMissions
  isLoading: boolean = false
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
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
