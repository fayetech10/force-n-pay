import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Seance } from '../interfaces/Seance';
import { SeanceService } from '../services/seance.service';

@Component({
  selector: 'app-seance-management',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl:'./seance-management.component.html',
  styleUrl: './seance-management.component.scss'
})
export class SeanceManagementComponent implements OnInit {

  seances: Seance[] = []
  constructor(private readonly seanceService: SeanceService){}
  ngOnInit(): void {
    this.loadSeances()
  }
  loadSeances() {
    this.seanceService.getAllSeance().subscribe({
      next: (seances) => {
        this.seances = seances
        console.log(this.seances)
      },
      error: (error) => {
        console.log("Erreur lors du chargement des seances", error)
      }
    })
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }

  formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    return `${hours}h${minutes}`;
  }
}
