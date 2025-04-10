import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Route, Router, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { User } from '../../interfaces/User';
import { MissionService } from '../../services/missions.service';
import { Mission } from '../../interfaces/Mission';
import { switchMap } from 'rxjs';
import { MissionDataService } from '../../services/components/MissionDataService.service';
@Component({
  selector: 'app-dashboardconsultant',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    CommonModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './dashboardconsultant.component.html',
  styleUrl: './dashboardconsultant.component.scss'
})
export class DashboardconsultantComponent implements OnInit {
  user!: User
  idUser!: number
  missions: Mission[] = []
  isloading: boolean = false
  constructor(
    private authService: AuthService,
    private router: Router,
    private missionDataService: MissionDataService
  ) { }
  ngOnInit(): void {
    this.loadMissions()
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/login"])
  }

  
  loadMissions(): void {
    this.isloading = true
    this.missionDataService.loadMissions().subscribe({
      next: (missions) => {
        this.missions = missions
        this.isloading = false
      },
      error: (error) => {
        console.log(error)
      }
    })

  }

  openDispute(payment: any) {
    // Implement dispute logic
  }

  addReport(mission: any) {
    // Implement report creation
  }
}
