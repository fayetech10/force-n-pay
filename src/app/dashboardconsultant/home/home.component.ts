import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Mission } from '../../interfaces/Mission';
import { MissionDataService } from '../../services/components/MissionDataService.service';
import { Observable } from 'rxjs';
import { MatMenuPanel, MatMenuTrigger } from '@angular/material/menu';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { User } from '../../interfaces/User';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateReportsComponent } from '../../components/create-reports/create-reports.component';
import { MissionDetailRapportComponent } from '../../components/mission-detail-rapport/mission-detail-rapport.component';

@Component({
  selector: 'app-home',
  imports: [
    MatIconModule,
    CommonModule,
    MatMenuTrigger,
    ScrollingModule,
    MatPaginator
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  pageSize: unknown;
  currentPage: unknown;
  onPageChange($event: PageEvent) {
    throw new Error('Method not implemented.');
  }
  missionMenu!: MatMenuPanel<any> | null;
  totalMissions: unknown;
  user!: User

  openDisputeDialog(_t85: { date: string; amount: number; status: string; }) {
    throw new Error('Method not implemented.');
  }
  downloadInvoice(_t85: { date: string; amount: number; status: string; }) {
    throw new Error('Method not implemented.');
  }
  getStatIconColor(arg0: any): string | string[] | Set<string> | { [klass: string]: any; } | null | undefined {
    throw new Error('Method not implemented.');
  }
  getStatIconBackground(arg0: any): string | string[] | Set<string> | { [klass: string]: any; } | null | undefined {
    throw new Error('Method not implemented.');
  }
  sortMenu!: MatMenuPanel<any> | null;
  paymentColumns = [
    {
      label: "Montant"
    },
    {
      label: "Date"
    },
    {
      label: "Montant"
    },
    {
      label: "Action"
    }
  ];
  openFilterDialog() {
    throw new Error('Method not implemented.');
  }
  unreadNotifications: any;
  stats: any;
  missions: any;
  openDispute(_t83: { date: string; amount: number; status: string; }) {
    throw new Error('Method not implemented.');
  }
  statsData = []

  missions$!: Observable<Mission[]>
  payments = [
    {
      date: '2024-03-05',
      amount: 4500,
      status: 'paid'
    },
    {
      date: '2024-02-28',
      amount: 3200,
      status: 'disputed'
    },
    // Add more payments...
  ];

  constructor(
    private dialog: MatDialog,
    private authService: AuthService, private missionDataService: MissionDataService) {
  }
  ngOnInit(): void {
    this.missions$ = this.missionDataService.missions$
    this.missionDataService.loadMissions().subscribe()

    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  openReportDialog(mission: Mission): void {
    this.dialog.open(CreateReportsComponent, {
      width: "1000px",
      data: { mission: mission }
    })
  }
  openDetailMission(mission: Mission) {
    this.dialog.open(MissionDetailRapportComponent, {
      width: "1000px",
      data: { mission: mission }
    })
  }
}
