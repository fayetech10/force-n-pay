import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mission } from '../../interfaces/Mission';
import { RapportService } from '../../services/rapport.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService } from '../../services/missions.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-mission-detail-rapport',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './mission-detail-rapport.component.html',
  styleUrl: './mission-detail-rapport.component.scss'
})
export class MissionDetailRapportComponent implements OnInit {

  selectedFile?: File;
  titre = '';
  missionId?: number;
  uploadProgress = 0;
  uploadCompleted = false;
  errorMessage = '';
  mission!: Mission
  formattedStartDate: string = '';
  formattedEndDate: string = '';
  showUploadForm: boolean = false;
  rapports!: any
  showFormUpdateMessionProgress: boolean = false
  progressValue: number | null = null;
  progressComment: string = '';
  constructor(
    private missionService: MissionService,
    private rapportService: RapportService,
    private dialogRef: MatDialogRef<MissionDetailRapportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mission: Mission }
  ) {
    this.mission = data.mission
  }
  ngOnInit(): void {
    this.loadRapportByMissionId()
  }
  loadRapportByMissionId(): void {
    this.rapportService.getRapportByMissionId(this.mission.id).subscribe({
      next: (rapports) => {
        this.rapports = rapports
        console.log(this.rapports)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  onFileSelected($event: any) {
    this.selectedFile = $event.target.files[0]
    this.errorMessage = ''
    if (this.selectedFile?.type !== "application/pdf") {
      this.errorMessage = 'Seul les fichier pdf sont acceptes'
      this.selectedFile = undefined
    }
  }
  addReport(): void {
    // Handle adding a new report
    console.log('Adding new report');
  }
  onSubmit(): void {
    if (!this.selectedFile || !this.titre || !this.mission.id) {
      this.errorMessage = 'tous les champs sont requis'
      return;
    }

    this.rapportService.uploadRapport(this.selectedFile, this.titre, this.mission.id).subscribe({
      next: (response) => {
        console.log("Fichier enregistre avec succes", response)
        this.loadRapportByMissionId()
        this.uploadCompleted = true
        setTimeout(() => {
          this.showUploadForm = false
        }, 1000);
        this.showFormUpdateMessionProgress = true
        this.resetForm()
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.message || "Une Erreur s'est produite"

      }
    })
  }
  resetForm(): void {
    this.selectedFile = undefined
    this.titre = ''

    setTimeout(() => {
      this.uploadCompleted = false
    }, 1000);
  }

  exportReports(): void {
    // Handle exporting reports
    console.log('Exporting reports');
  }

  updateMissionProgress() {
    if (typeof this.progressValue !== 'number' || this.progressValue < 0 || this.progressValue > 100) {
      this.errorMessage = "La progression doit être un nombre entre 0 et 100"
      return
    }
    const originalProgess = this.mission.progress
    this.mission.progress = this.progressValue

    this.missionService.updateMissionProgression(this.mission).subscribe({
      next: (updateMission) => {
        this.mission = updateMission
        this.showFormUpdateMessionProgress = false
      },
      error: (err) => {
        this.mission.progress = originalProgess
        console.log(err)
      }
    })
  }

  viewReport(reportId: number): void {
    // Handle viewing a report
    console.log('Viewing report:', reportId);
  }
}
